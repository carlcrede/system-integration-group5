const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authentication.js');
const inviteRouter = require('./routes/invite.js');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

require('dotenv').config({ path: './.env' });

const app = express();
// app.use(express.logger());   // Isn't bundled with express anymore
app.use(bodyParser.json());
app.use(cookieParser());    // for jwt i assume
app.use(session({ secret: process.env.SECRET, cookie: { maxAge: 60000 }})); // todo understand sessions better
app.use(passport.initialize());
app.use(passport.session());
app.use(authRouter);
app.use(inviteRouter);

// passport config
//passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database');
});

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});