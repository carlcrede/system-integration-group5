const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// create invite
router.route('/invites')
    .post(userController.createInvite);

// accept ivite
router.route('/invite/:token')
    .get(userController.acceptInvite);

module.exports = router;