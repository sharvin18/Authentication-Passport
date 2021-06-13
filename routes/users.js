const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

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

module.exports = router;