const passport = require('passport');
const User = require('./../models/User');

// log in with credentials
async function logIn(req, res) {
    passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.user); // returns user, but is it a bad idea to return user with salt and hash parameters? // Todo ask
    });
}

// log in with jwt
async function logInJWT(req, res) {
    res.send("pong");       // TODO
}


async function signUp(req, res) {   // is this even async?
    User.register(new User({
        email: req.body.email,
        name: req.body.name
    }),
    req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: err
            });
        } else {
            User.authenticate('local')(req, res, () => {
                User.findOne({                  // TODO why do I request user from db and then do nothing?
                    email: req.body.email
                }, (err, user) => {
                    // just returns message that registration was successful
                    // we could return the created user so the integraters can do something with it
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        success: true,
                        status: 'Registration Successful!'
                    });
                });
            });
        }
    });
}

async function acceptInvite() {

}


module.exports = {
    logIn,
    logInJWT,
    signUp,
    acceptInvite
};