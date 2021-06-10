const express = require('express');
const router = express.Router();

// Login Page
router.get('/login', (req, res) => {
    res.send('Welcome to the Login page');
});

// Sign Up
router.get('/signup', (req, res) => {
    res.send('Welcome to the Sign Up page');
});

module.exports = router;