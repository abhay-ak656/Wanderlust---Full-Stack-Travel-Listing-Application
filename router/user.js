const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../Model/user.js');
const { saveredirecrUrl, isLoggedIn } = require('../Middleware/middleware.js');
const controller = require('../Controller/user.js');
require('dotenv').config();

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.route('/singup')
    .get(controller.signupform)
    .post(controller.signup)

router.route('/login')
    .get(controller.loginform)
    .post(saveredirecrUrl,
        passport.authenticate('local',
            {
                failureRedirect: '/listing/user/login',
                failureFlash: true
            }),
        controller.loginvalidation)

router.get('/logout', controller.Logout);
router.route('/favrioute')
.get(isLoggedIn,controller.favlist);


router.get('/forgotrequest',controller.forgotrequest);
router.get('/forgot-password',controller.forgotpassword);

router.route('/reset-password/:token')
.get(controller.resetpasswordform)
.post(controller.resetpassword)



module.exports = router;