const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const User = require('../models/User');

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

// Get all users (Admin-only)
router.get('/', authenticate, authorize(['Admin']), async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role'] });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// Update user role (Admin-only)
router.put('/:id/role', authenticate, authorize(['Admin']), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['Admin', 'Moderator', 'User'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        await user.save();
        res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user role", error });
    }
});

module.exports = router;
