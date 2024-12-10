// models.js

const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize and connect to PostgreSQL
const sequelize = new Sequelize('postgres://setup_linux:exhall2024@localhost:5432/setup_linux_notes', {
    dialect: 'postgres',
    logging: false, // Disable logging; enable if needed for debugging
});

// Define the LearningObjective model
const LearningObjective = sequelize.define('LearningObjective', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false, // Ensure ID cannot be null
        // autoIncrement removed to allow manual ID assignment
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    link: { // Added link field
        type: DataTypes.STRING,
        allowNull: true,
        //validate: {
        //    isUrl: true,
        //},
    },
    comments: { // Added comments field
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'learning_objectives',
});

// Synchronize the model with the database
sequelize.sync({ alter: true }) // Use { alter: true } to update table without dropping
    .then(() => {
        console.log('Database synchronized successfully.');
    })
    .catch((error) => {
        console.error('Error synchronizing the database:', error);
    });

// Export the LearningObjective model and sequelize instance
module.exports = { LearningObjective, sequelize };