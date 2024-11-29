const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register User

router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        // Check if a user with the same username already exists
        const existingUsername = await User.findOne({
            where: { username }
        });

        if (existingUsername) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        // If no existing user, create a new one
        const user = await User.create({ username, email, password, role });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token,role: user.role });
    } catch (error) {
        res.status(400).json({ message: "Error logging in", error });
    }
});

module.exports = router;
