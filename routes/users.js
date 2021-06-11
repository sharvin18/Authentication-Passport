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
    console.log(res.body);
    res.send("Post request successful");
});

module.exports = router;