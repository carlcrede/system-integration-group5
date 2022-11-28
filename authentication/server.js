const app = require("express")();
const server = require("http").createServer(app);
const port = process.env.PORT || 8080;
const User = require('./models/User');
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const cookieParser = require('cookie-parser');
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const router = require('./routers/router.js');
const Schema = mongoose.Schema;
const Wishlist = require('./models/Wishlist');
const ObjectId = Schema.ObjectId;
const sessionMiddleware = session({ secret: process.env.SECRET, resave: false, saveUninitialized: false });
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const userController = require('./controllers/userController');
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
const Strategy = User.createStrategy()
passport.use(Strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(router);
const Invite = require('./models/Invite');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wishlist API',
            version: '0.0.1',
        },
    },
    apis: ['./routers/*.js'],
};

const openapiSpecification = swaggerJsDoc(options);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database');
    });


// Endpoints for testing
//
app.get("/", (req, res) => {
    const isAuthenticated = !!req.user;
    if (isAuthenticated) {
        console.log(`user is authenticated, session is ${req.session.id}, user is ${req.user.name}`);
    } else {
        console.log("unknown user");
    }
    res.sendFile(isAuthenticated ? "index.html" : "login.html", { root: __dirname + "/public" });
});
app.get("/login.html", (req, res) => {
    const isAuthenticated = !!req.user;
    res.sendFile(isAuthenticated ? "index.html" : "login.html", { root: __dirname + "/public" });
});
app.get("/index.html", (req, res) => {
    const isAuthenticated = !!req.user;
    res.sendFile(isAuthenticated ? "index.html" : "login.html", { root: __dirname + "/public" });
});


app.post("/logout", (req, res) => {
    console.log(`logout ${req.session.id}`);
    const socketId = req.session.socketId;
    if (socketId && io.of("/").sockets.get(socketId)) {
        console.log(`forcefully closing socket ${socketId}`);
        io.of("/").sockets.get(socketId).disconnect(true);
    }
    req.logout(function (err) {
        if (err) { return next(err); }
        res.cookie("connect.sid", "", { expires: new Date() });
        res.redirect("/login.html");
    });
});
//
// Endpoints for testing


passport.use(Strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const io = require('socket.io')(server);

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(bodyParser.json()));
io.use(wrap(cookieParser()));
io.use(wrap(bodyParser.urlencoded({ extended: false })));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
    if (socket.request.user) {
        next();
    } else {
        next(new Error('unauthorized'))
    }
});



const SESSION_RELOAD_INTERVAL = 30 * 1000;
const onlineFriends = new Map();
const offlineFriends = new Map();
const notRegisteredFriends = new Map();
const room = {};
io.on('connection', (socket) => {
    console.log(`new connection ${socket.id} for user ${socket.request.user.name}`);

    // emit logged in user's name and email to show on web page
    socket.emit('name', socket.request.user.name);
    socket.emit('email', socket.request.user.email);

    // get the session id from the request
    const session = socket.request.session;
    console.log(`saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id;
    session.save();

    const timer = setInterval(() => {
        socket.request.session.reload((err) => {
            if (err) {
                // forces the client to reconnect
                socket.conn.close();
                console.log(`closing socket ${socket.id} due to session reload error`);
            }
        });
    }, SESSION_RELOAD_INTERVAL);

    socket.on("message", (data) => {
        io.in(data.room).emit("message", {
            user: socket.request.user.name,
            message: data.message
        });
    });

    socket.on('joinroom', (roomId) => {

        onlineFriends.set(socket.request.user.email, socket.request.user.name)
        offlineFriends.delete(socket.request.user.email)

        function getWishlistUsers() {
            try {
                userController.getCurrentWishlist(roomId).then((wishlist) => {
                    wishlist.invites.forEach(invite => {
                        if (invite.status === 'pending') {
                            notRegisteredFriends.set(invite.email, "Unknown")
                            const serializedNotRegisteredFriends = JSON.stringify([...notRegisteredFriends]);
                            io.in(roomId).emit('notRegistered', serializedNotRegisteredFriends);
                            console.log("api: " + invite.email + " not registered");
                        } else if (invite.status === 'accepted') {
                            userController.getUserByEmail(invite.email).then((user) => {
                                if (user && user.email === socket.request.user.email) {  // TODO FIX!!!
                                    offlineFriends.set(user.email, user.name) // TODO FIX!!!
                                    console.log("api: " + user.name + " registered");  // TODO FIX!!!
                                }
                            })
                        }
                    });
                });
            } catch (err) {
                console.log(err);
            }
            console.log("User " + socket.request.user.name + " joined room \"" + roomId + "\"");
        }

        if (!roomId) {
            room[roomId] = {};
            socket.join(roomId);
            io.in(roomId).emit("room", socket.request.user.name);
            getWishlistUsers();
        } else {
            socket.join(roomId);
            io.in(roomId).emit("room", socket.request.user.name);
            getWishlistUsers();
        }
        const serializedOnlineFriends = JSON.stringify([...onlineFriends]);
        const serializedOfflineFriends = JSON.stringify([...offlineFriends]);
        const serializedNotRegisteredFriends = JSON.stringify([...notRegisteredFriends]);

        // emit online friends to show on web page
        io.in(roomId).emit('online', serializedOnlineFriends);
        io.in(roomId).emit('offline', serializedOfflineFriends);
        io.in(roomId).emit('notRegistered', serializedNotRegisteredFriends);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            console.log("User " + socket.request.user.name + " left room " + room); // the Set contains at least the socket ID
            onlineFriends.delete(socket.request.user.email)
            offlineFriends.set(socket.request.user.email, socket.request.user.name)
            const serializedOfflineFriends = JSON.stringify([...offlineFriends]);
            const serializedOnlineFriends = JSON.stringify([...onlineFriends]);

            // emit offline friends to show on web page
            io.in(room).emit('offline', serializedOfflineFriends);
            io.in(room).emit('online', serializedOnlineFriends);
        });
    });

    socket.on('disconnect', () => {
        clearInterval(timer);
        console.log(`user ${socket.request.user.email} with socket ${socket.id} disconnected`);
    });
});

server.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
});
