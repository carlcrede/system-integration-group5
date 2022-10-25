const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const passport = require('passport');
const User = require('./../models/User');

// log in using local strategy (email/password)
router.route('/login').post(userController.logIn);

// log in using jwt strategy
router.route('/login/jwt')
    .post(userController.logInJWT);

// signing up
router.route('/signup')
    .post(userController.signUp);

module.exports = router;