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

async function getInvite(req, res) {
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


async function acceptInvite(req, res) {
    // check if invite actually exists
    Invite.findOne({
        invitee_email: req.params.invitee_email,
        invited_email: req.params.invited_email
    }, async (err, invite) => {
        if (err) {
            res.statusCode = 500;
            res.json({ err: err });
        }
        else if (!invite) {
            res.statusCode = 404;
            res.json({ err: "Invite not found" });
        }
        else {
            if (!req.body.password) {
                res.statusCode = 400;
                res.json({ message: 'No password was proivided'});
            } else {
                const user = new User({
                    email: req.params.invited_email,
                    name: req.body.name,
                    picturePath: req.body.picturePath
                });
                await user.setPassword(req.body.password); // passport will salt and hash password for us
                await user.save().then(() => {
                    // delete invitation
                    Invite.deleteOne({
                        invitee_email: req.params.invitee_email,
                        invited_email: req.params.invited_email
                    }).then(() => {
                        res.statusCode = 200;
                        res.json({
                            message: 'Invite accepted',
                            user: user
                        });
                    });
                });
            }
        }
    });
}

async function acceptInviteToken(req, res) {
      // check if invite actually exists
      Invite.findOne({
        token: req.params.token
    }, async (err, invite) => {
        if (err) {
            res.statusCode = 500;
            res.json({ err: err });
        }
        else if (!invite) {
            res.statusCode = 404;
            res.json({ err: "Invite not found" });
        }
        else {
            if (!req.body.password) {
                res.statusCode = 400;
                res.json({ message: 'No password was proivided'});
            } else {
                const user = new User({
                    email: invite.invited_email,
                    name: req.body.name,
                    picturePath: req.body.picturePath
                });
                await user.setPassword(req.body.password); // passport will salt and hash password for us
                await user.save().then(() => {
                    // delete invitation
                    Invite.deleteOne({ token: req.params.token }).then(() => {
                        res.statusCode = 200;
                        res.json({
                            message: 'Invite accepted',
                            user: user
                        });
                    });
                });
            }         
        }
    });
}

module.exports = {
    logIn,
    signUp,
    createInvite,
    getInvite,
    acceptInvite,
    acceptInviteToken
};