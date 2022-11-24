const passport = require('passport');
const Invite = require('../models/Invite');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;



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

async function createWishlist(req, res) {
    const wishlist = new Wishlist({
        title: req.body.name,
        description: req.body.description,
        owner: req.user._id,
        invites: []
    });
    wishlist.save().then(() => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(wishlist);
    }).catch(err => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            err: err
        });
    });
}

async function getWishlist(req, res) {
    Wishlist.findOne({
        _id: new ObjectId(req.params.id)
    }, (err, wishlist) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: err
            });
        }
        else if (!wishlist) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: "Wishlist not found"
            });
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(wishlist);
        }
    });
}

async function getAllWishlists(req, res) {
    Wishlist.find({
        owner: req.user._id
    }, (err, wishlists) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: err
            });
        }
        else if (!wishlists) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: "No wishlists found"
            });
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(wishlists);
        }
    });
}

async function createInvite(req, res) {
    Wishlist.findOne({
        _id: new ObjectId(req.params.id)
    }, (err, wishlist) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: err
            });
        }
        else if (!wishlist) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: "Wishlist not found"
            });
        }
        else {
            const invite = new Invite({
                email: req.body.email,
                status: req.body.status,
                expiresAt: Date.now() + 2 * 24 * 60 * 60 * 1000, // now + 2 days
                token: uuidv4(),
            });
            wishlist.invites.push(invite);
            wishlist.save().then(() => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(invite);
            }
            ).catch(err => {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    err: err
                });
            }
            );
        }
    });
}

async function acceptInvite(req, res) {
    Wishlist.findOne({
        _id: new ObjectId(req.params.id)
    }, (err, wishlist) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: err
            });
        }
        else if (!wishlist) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: "Wishlist not found"
            });
        }
        else {
            const invite = wishlist.invites.find(invite => invite.token === req.params.token);
            if (invite) {
                if (invite.status === 'accepted') {
                    res.statusCode = 409;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        err: "Invite already accepted"
                    });
                }
                else if (invite.status === 'expired') {
                    res.statusCode = 410;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        err: "Invite expired"
                    });
                }
                else {
                    invite.status = 'accepted';
                    wishlist.save().then(() => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(invite);
                    }
                    ).catch(err => {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            err: err
                        });
                    }
                    );
                }
            }
            else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    err: "Invite not found"
                });
            }
        }
    });
}

function authenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.statusCode = 403;
    res.json({ message: 'You need to log in!' });
}

function logout(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next;
        }

        res.statusCode = 200;
        res.json({ message: 'You have been logged out' });
    });
}

module.exports = {
    signUp,
    logIn,
    logout,
    createWishlist,
    getWishlist,
    getAllWishlists,
    createInvite,
    acceptInvite,
    authenticate
};