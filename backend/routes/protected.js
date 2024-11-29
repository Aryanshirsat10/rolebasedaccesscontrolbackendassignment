const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/admin', authenticate, authorize(['Admin']), (req, res) => {
    res.status(200).json({ message: "Welcome, Admin!" });
});

router.get('/user', authenticate, authorize(['User', 'Moderator', 'Admin']), (req, res) => {
    res.status(200).json({ message: "Hello, User!" });
});

module.exports = router;
