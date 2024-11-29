require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sequelize = require('./models/index'); // SQLite database connection

const authRoutes = require('./routes/auth'); // Authentication routes
const protectedRoutes = require('./routes/protected'); // Role-based protected routes
const userRoutes = require('./routes/user'); // User management routes

const app = express();

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors()); // Enables CORS for cross-origin requests
app.use(express.json()); // Parses JSON request bodies

// Routes
app.use('/api/auth', authRoutes); // Routes for authentication (register, login)
app.use('/api/protected', protectedRoutes); // Routes for role-protected resources
app.use('/api/users', userRoutes); // Routes for user management (profile, role updates)

// Sync database and start server
const PORT = process.env.PORT || 5000;

(async () => {
    try {
        // Synchronize database models
        await sequelize.sync({ force: false }); // Set `true` to drop and recreate tables on each start
        console.log("Database synchronized successfully!");

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to initialize the application:", error);
    }
})();
