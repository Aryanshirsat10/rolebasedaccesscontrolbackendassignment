const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const User = require('../models/User');
const authorizeAdmin = require('../middleware/adminauthMiddleware');

const router = express.Router();

// Get logged-in user's profile
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'email', 'role','createdAt'] });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error });
    }
});

module.exports = router;
