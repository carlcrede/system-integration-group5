const passport = require('passport');
const Invite = require('../models/Invite');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');


async function logIn(req, res) {
    res.statusCode = 200;
    res.json(req.user);     // user is inserted by passport into req so we simply send it back
}


async function signUp(req, res) {
    User.register(new User({
        email: req.body.email,
        name: req.body.name
    }),
        req.body.password, (err, user) => {
            if (err) {
                if (err.name === 'UserExistsError') {
                    res.statusCode = 409;
                } else {
                    res.statusCode = 400;
                }
                res.json({ err: err });
            } else {
                res.statusCode = 201;
                res.json({
                    success: true,
                    status: 'Registration Successful!'
                });
            }
        });
}

async function createInvite(req, res) {
    const invite = new Invite({
        invitee_email: req.body.invitee_email,
        invited_email: req.body.invited_email,
        expiration: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days
        token: uuidv4()
    });
    invite.save().then(() => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(invite);
    }).catch(err => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            err: err
        });
    });
}

async function acceptInvite(req, res) {
    Invite.findOne({
        token: req.params.token
    }, (err, invite) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: err
            });
        }
        else if (!invite) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: "Invite not found"
            });
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(invite);
        }
    });
}

module.exports = {
    logIn,
    signUp,
    createInvite,
    acceptInvite
};