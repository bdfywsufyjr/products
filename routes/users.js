var path = require('path');
require('dotenv').config({path: path.join(__dirname, ".env")});

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

var User = require('../models/user');

var appAdmin = process.env.APP_ADMIN;
var appPassword = process.env.APP_PASSWORD;
var secret = process.env.SECRET;

var User = require('../models/user');

router.get('/setup', function(req, res) {

    // create a sample user
    var user = new User({
        name: appAdmin,
        password: appPassword,
        admin: true
    });
    user.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
router.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({name: req.body.name}, (err, user) => {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var payload = {admin: user.admin}
                var token = jwt.sign(payload, secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                res.json({success: true, token: token});
            }
        }
    });
});

module.exports = router;
