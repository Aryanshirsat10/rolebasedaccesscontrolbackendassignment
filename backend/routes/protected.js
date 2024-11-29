const express = require('express');
const authorizeAdmin = require('../middleware/adminauthMiddleware');
const User = require('../models/User');

const router = express.Router();

router.get('/users', authorizeAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Update user role (Admin only)
router.put('/:userId/role', authorizeAdmin, async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error });
    }
});
// In your users route controller (e.g., users.js)
router.put('/:userId/permissions', authorizeAdmin, async (req, res) => {
    const { userId } = req.params;
    const { permission, value } = req.body; // permission could be 'view', 'edit', etc.
    
    try {
        // Find the user by their ID
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the 'permissions' field is undefined, initialize it as an empty object
        if (!user.permissions) {
            user.permissions = {};
        }

        // Update the permission for the user
        user.permissions = {
            ...user.permissions, // Keep existing permissions
            [permission]: value, // Update the specific permission
        };

        // Save the updated user record
        await user.save();

        // Respond with the updated user
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating permissions:', error);
        res.status(500).json({ message: 'Error updating permissions', error });
    }
});

module.exports = router;
