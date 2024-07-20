const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
const router = express.Router();

router.post('/signup', authController.normalSignup)

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/oauth/google/callback', passport.authenticate('google', {
//   successRedirect: `${process.env.FRONTEND_URL}/user`,
//   failureRedirect: `${process.env.FRONTEND_URL}/login`
// }));

module.exports = router;
