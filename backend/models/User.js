const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./index');

// Define User Model
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('Admin', 'Moderator', 'User'), defaultValue: 'User' },
    permissions: { 
        type: DataTypes.JSON, 
        defaultValue: {} // Default to empty permissions
    },
},{
        timestamps: true,
    }
);

// Hash password before saving
User.beforeCreate(async (user) => {
    // Check if this is the first user being created
    const userCount = await User.count();

    // If no users exist, set the role to 'Admin' for the first user
    if (userCount === 0) {
        user.role = 'Admin';
    }

    // Hash the password before saving
    user.password = await bcrypt.hash(user.password, 10);
});


// Compare hashed password
User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = User;
