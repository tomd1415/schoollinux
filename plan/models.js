// models.js

const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize and connect to PostgreSQL
const sequelize = new Sequelize('postgres://setup_linux:exhall2024@localhost:5432/setup_linux_notes', {
    dialect: 'postgres',
    logging: false, // Disable logging; enable if needed for debugging
});

// Phase Model
const Phase = sequelize.define('Phase', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    tableName: 'phases',
});

// Step Model
const Step = sequelize.define('Step', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    stepId: { // Added stepId field
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phaseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Phase,
            key: 'id',
        },
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    tableName: 'steps',
});

// LearningObjective Model
const LearningObjective = sequelize.define('LearningObjective', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    stepId: { // Add this field
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Step,
            key: 'stepId',
        },
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

// Checkbox Model
const Checkbox = sequelize.define('Checkbox', {
    id: { // Auto-incremented ID remains as primary key
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    label: {
        type: DataTypes.TEXT,
        allowNull: true, // Make this field nullable if label is not always provided
    },
    stepId: {
        type: DataTypes.STRING,
        allowNull: false,
        // Remove 'unique: true' to prevent conflicts
        references: {
            model: Step,
            key: 'stepId',
        },
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    tableName: 'checkboxes',
});

// Associations
Phase.hasMany(Step, { foreignKey: 'phaseId', as: 'steps', onDelete: 'CASCADE' });
Step.belongsTo(Phase, { foreignKey: 'phaseId', as: 'phase' });

Step.hasMany(Checkbox, { foreignKey: 'stepId', as: 'checkboxes', onDelete: 'CASCADE' });
Checkbox.belongsTo(Step, { foreignKey: 'stepId', as: 'step' });

LearningObjective.belongsTo(Phase, { foreignKey: 'phaseId', as: 'phase' });
LearningObjective.belongsTo(Step, { foreignKey: 'stepId', as: 'step' }); // **Review this association**

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
    Phase,
    Step,
    Checkbox,
    sequelize,
};