const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Sends an login request in json format
 *     description: Login using email and password
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: "email@email.com"
 *               password:
 *                 type: string
 *                 default: "123"
 *     responses:
 *       200:
 *         description: Returns a user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 salt:
 *                   type: string
 *                 hash:
 *                   type: string
 *       403:
 *         description: Returns an error message if password is incorrect
 *       404:
 *         description: User was not found
 */
router.route('/login')
    .post(passport.authenticate('local'), userController.logIn);

/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Sends an signup request in json format
 *     description: Signup using email and password
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: "email@email.com"
 *               password:
 *                 type: string
 *                 default: "123"
 *               name:
 *                 type: string
 *                 default: "Steve Jobs"
 *               picturePath:
 *                 type: string
 *     responses:
 *       201:
 *         description: Returns a success message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *       409:
 *         description: Returns an error message if email is already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: object
 *       400:
 *         description: Bad request. A parameter is most likely missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: object
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