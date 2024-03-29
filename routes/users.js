const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Sign Up
router.get('/register', (req, res) => {
    res.render('register');
});

// POST - register
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;

    let errors = [];

    /// check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all the details'});
    }

    /// Check password match
    if(password != password2){
        errors.push({msg: 'Passwords do not match'});
    }

    /// Check password length
    if(password.length < 6){
        errors.push({msg: 'Password should be atleats 6 characters long'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name, 
            email,
            password,
            password2
        });
    }else{
        
        /// Validation passed
        User.findOne({ email: email})
            .then(user => {
                if(user){
                    /// User exists
                    errors.push({msg: 'The email already exists!'});

                    res.render('register', {
                        errors,
                        name, 
                        email,
                        password,
                        password2
                    });
                }else{
                    const newUser = User({
                        name,
                        email,
                        password
                    });
                    
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {

                            if(err) throw err;

                            /// Set password to hash
                            newUser.password = hash;

                            /// Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Registered successfully');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                    }));
                }
            });
    }
});

/// Handling logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

/// Handling login 
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// OAuth
router.get('/auth/google', 
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }
));

router.post('/auth/google/callback', (req, res, next) =>{
    passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;