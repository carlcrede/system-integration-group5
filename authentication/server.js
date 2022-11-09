const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const router = require('./routers/router.js');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const session = require('express-session');

require('dotenv').config({ path: './.env' });

const app = express();
app.use(cors());

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

// app.use(express.logger());   // Isn't bundled with express anymore
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

// passport config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database');
    });

app.get('/', (req, res) => {
    res.send('Hello from App Engine!');
});


const PORT = process.env.port || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});