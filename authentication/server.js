const app = require("express")();
const server = require("http").createServer(app);
const port = process.env.PORT || 8080;
const User = require('./models/User');
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const cookieParser = require('cookie-parser');
// const session = require("express-session");                                                                                                                   // TODO
const bodyParser = require("body-parser");
const passport = require("passport");
const router = require('./routers/router.js');
const Schema = mongoose.Schema;
const Wishlist = require('./models/Wishlist');
const ObjectId = Schema.ObjectId;
// const sessionMiddleware = session({ secret: process.env.SECRET, resave: false, saveUninitialized: false, cookie: { sameSite: 'none', secure: false } });     // TODO
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const userController = require('./controllers/userController');
const cors = require('cors');
// app.use(sessionMiddleware);                                                                                                                                  // TODO
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
// app.use(passport.session());    // remove TODO check                                                                                                        // TODO
app.use(cors({  // TODO check if this is still needed
    credentials: true, 
    origin: true 
}));
const Strategy = User.createStrategy()
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
    algorithms: ['HS256']
};
passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
    User.findOne({ _id: payload.sub }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));
app.use(router);
const Invite = require('./models/Invite');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wishlist API',
            version: '0.0.1',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
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
//
// Endpoints for testing


passport.use(Strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const io = require('socket.io')(server);

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

//io.use(wrap(sessionMiddleware));
io.use(wrap(bodyParser.json()));
io.use(wrap(cookieParser()));
io.use(wrap(bodyParser.urlencoded({ extended: false })));
io.use(wrap(passport.initialize()));
//io.use(wrap(passport.session()));

io.use((socket, next) => {
    if (socket.request.user) {
        next();
    } else {
        next(new Error('unauthorized'))
    }
});



const SESSION_RELOAD_INTERVAL = 30 * 1000;
var onlineFriends = [];
var offlineFriends = [];
var notRegisteredFriends = [];
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

        function getWishlistUsers() {
            try {
                userController.getCurrentWishlist(roomId).then((wishlist) => {
                    wishlist.invites.forEach(invite => {
                        if (invite.status === 'pending') {
                            if (!notRegisteredFriends.find(node => node.email === invite.email)) {
                                notRegisteredFriends.push({ "email": invite.email, "name": "Unknown" })
                            }
                            io.in(roomId).emit('notRegistered', notRegisteredFriends);
                            console.log("api: " + invite.email + " not registered");
                        } else if (invite.status === 'accepted') {
                            userController.getUserByEmail(invite.email).then((user) => {
                                if (!offlineFriends.find(node => node.email === user.email)) {
                                    offlineFriends.push({ "email": user.email, "name": user.name })
                                }
                                console.log("api: " + user.email + "-" + user.name + " registered");
                            })
                        }
                    });
                });
            } catch (err) {
                console.log(err);
            }
            console.log("User " + socket.request.user.name + " joined room \"" + roomId + "\"");
        }
        if (!onlineFriends.find(node => node.email === socket.request.user.email)) {
            onlineFriends.push({ "email": socket.request.user.email, "name": socket.request.user.name })
        }
        offlineFriends = offlineFriends.filter(node => node.email !== socket.request.user.email);
        setTimeout(function () {
            io.in(roomId).emit('online', onlineFriends);
            io.in(roomId).emit('offline', offlineFriends);
            io.in(roomId).emit('notRegistered', notRegisteredFriends);
        }, 1000);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            console.log("User " + socket.request.user.name + " left room " + room); // the Set contains at least the socket ID
            onlineFriends = onlineFriends.filter(node => node.email !== socket.request.user.email);
            if (!offlineFriends.find(node => node.email === socket.request.user.email)) {
                offlineFriends.push({ "email": socket.request.user.email, "name": socket.request.user.name })
            }
            // emit offline friends to show on web page
            io.in(room).emit('offline', offlineFriends);
            io.in(room).emit('online', onlineFriends);
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
