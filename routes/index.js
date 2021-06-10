const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Welcome to the browser');
});

module.exports = router;
