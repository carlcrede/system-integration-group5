const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');
const User = require('../models/User');

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Sends an login request in json format
 *     description: Login using email and password
 *     responses:
 *       200:
 *         description: Returns an user.
 */
router.route('/login').post(userController.logIn);

/**
 * @openapi
 * /login/jwt:
 *   post:
 *     summary: Sends an login request in json format
 *     description: Login using jwt
 *     responses:
 *       200:
 *         description: Returns PONG.
 */
router.route('/login/jwt')
    .post(userController.logInJWT);

/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Sends an signup request in json format
 *     description: Signup using email and password
 *     responses:
 *       200:
 *         description: Returns a success message.
 */
router.route('/signup')
    .post(userController.signUp);

/**
 * @openapi
 * /invites:
 *   post:
 *     summary: Sends an invite in json format
 *     description: Send an invite to a user
 *     responses:
 *       200:
 *         description: Returns an invite.
 */
router.route('/invites')
    .post(userController.createInvite);

/**
 * @openapi
 * /invite/{token}:
 *   get:
 *     summary: Returns an invite in json format
 *     description: Get an invite
 *     responses:
 *       200:
 *         description: Returns an object of an invite.
 */
router.route('/invite/:token')
    .get(userController.acceptInvite);

module.exports = router;