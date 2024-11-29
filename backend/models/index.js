const { Sequelize } = require('sequelize');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Database file
    logging: false, // Disable logging for clean output
});

// Test the connection
sequelize.authenticate()
    .then(() => console.log('SQLite database connected!'))
    .catch(err => console.error('Failed to connect to SQLite:', err));

module.exports = sequelize;
