// models.js

const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize and connect to PostgreSQL
const sequelize = new Sequelize('postgres://setup_linux:exhall2024@localhost:5432/setup_linux_notes', {
    dialect: 'postgres',
    logging: false, // Disable logging; enable if needed for debugging
});

// Existing LearningObjective Model
const LearningObjective = sequelize.define('LearningObjective', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        // autoIncrement removed to allow manual ID assignment
    },
    phase: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    step: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    task: {
        type: DataTypes.INTEGER,
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

// New Phase Model
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

// New Step Model
const Step = sequelize.define('Step', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    tableName: 'steps',
});

// New Checkbox Model
const Checkbox = sequelize.define('Checkbox', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    stepId: { // Foreign key to Step
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Step,
            key: 'id',
        },
    },
}, {
    timestamps: true,
    tableName: 'checkboxes',
});

// Define Associations

// Phase hasMany Steps
Phase.hasMany(Step, {
    foreignKey: 'phaseId',
    as: 'steps',
    onDelete: 'CASCADE',
});

// Step belongsTo Phase
Step.belongsTo(Phase, {
    foreignKey: 'phaseId',
    as: 'phase',
});

// Step hasMany Checkboxes
Step.hasMany(Checkbox, {
    foreignKey: 'stepId',
    as: 'checkboxes',
    onDelete: 'CASCADE',
});

// Checkbox belongsTo Step
Checkbox.belongsTo(Step, {
    foreignKey: 'stepId',
    as: 'step',
});

// Synchronize the models with the database
sequelize.sync({ force: true }) // Use { alter: true } to update tables without dropping
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