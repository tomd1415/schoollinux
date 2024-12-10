// models.js

const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize and connect to PostgreSQL
const sequelize = new Sequelize('postgres://setup_linux:exhall2024@localhost:5432/setup_linux_notes', {
    dialect: 'postgres',
    logging: false, // Disable logging
});

// Simplified LearningObjective Model
const LearningObjective = sequelize.define('LearningObjective', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'learning_objectives',
});

// Synchronize the models with the database
sequelize.sync({ alter: true }) // Use { alter: true } to update tables without dropping
    .then(() => {
        console.log('Database synchronized successfully.');
    })
    .catch((error) => {
        console.error('Error synchronizing the database:', error);
    });

// Export the models and sequelize instance
module.exports = {
    LearningObjective,
    sequelize,
};