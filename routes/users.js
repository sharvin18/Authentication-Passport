const express = require('express');
const router = express.Router();

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
        res.send('Pass');
    }
});

module.exports = router;