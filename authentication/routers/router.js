const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');


/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Sends an signup request in json format
 *     description: Signup using email and password
 *     tags: 
 *          - Authentication
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
 * /login:
 *   post:
 *     summary: Sends an login request in json format
 *     description: Login using email and password
 *     tags: 
 *          - Authentication
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     salt:
 *                       type: string
 *                     hash:
 *                       type: string
 *                 jwt:
 *                    type: object
 *                    properties:
 *                      token:
 *                          type: string
 *                      expires:
 *                          type: string
 *                    
 *       403:
 *         description: Returns an error message if password is incorrect
 *       404:
 *         description: User was not found
 */
 router.route('/login')
 .post(passport.authenticate('local', { session: false }), userController.logIn);

/**
 * @openapi
 * /logout:
 *   post:
 *     deprecated: true
 *     summary: Logs the user out and ends the session
 *     description: Ends the session. If the user tries to use the same session they will not be allowed to. This is now deprecated. To log out simply delete the jwt on the client side
 *     tags: 
 *          - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
 //router.route('/logout').post(passport.authenticate('jwt', { session: false }), userController.logout);   // deprecated, to log out simply delete jwt token from client side

/**
 * @openapi
 * /wishlists:
 *   post:
 *     summary: Creates a wishlist in json format
 *     description: Create a wishlist on the logged in user
 *     tags: 
 *          - Wishlists
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a wishlist.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                  type: string
 *                  default: "Christmas"
 *               description:
 *                  type: string
 *                  default: "Christmas gifts"
 */
router.route('/wishlists')
    .post(passport.authenticate('jwt', { session: false }), userController.createWishlist);

/**
 * @openapi
 * /wishlists/{id}:
 *   get:
 *     summary: Get a wishlist in json format
 *     description: Get a wishlist with the given id
 *     tags: 
 *          - Wishlists
 *     responses:
 *       200:
 *         description: Returns a wishlist.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The wishlist id
 */
 router.route('/wishlists/:id')
 .get(userController.getWishlist);

 /**
 * @openapi
 * /wishlists:
 *   get:
 *     summary: Get all wishlists in json format
 *     description: Get all wishlists of the logged in user
 *     tags: 
 *          - Wishlists
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all wishlists.
 */
  router.route('/wishlists')
  .get(passport.authenticate('jwt', { session: false }), userController.getAllWishlists);

/**
 * @openapi
 * /wishlists/{id}/invites:
 *   post:
 *     summary: Sends an invite in json format
 *     description: Send an invite to a user
 *     tags: 
 *          - Invites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns an invite.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The wishlist id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: "kimon@email.com"
 */
router.route('/wishlists/:id/invites')
    .post(passport.authenticate('jwt', { session: false }), userController.createInvite);

/**
 * @openapi
 * /wishlists/{id}/invites/{token}:
 *   get:
 *     summary: Accepts an invite and gets it in json format
 *     description: Accept and get an invite
 *     tags: 
 *          - Invites
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The wishlist id
 *       - in: path
 *         name: token
 *         required: true
 *         type: string
 *         description: The invite token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns an object of an invite.
 */
 router.route('/wishlists/:id/invites/:token')
 .get(passport.authenticate('jwt', { session: false }), userController.acceptInvite);

module.exports = router;