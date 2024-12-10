// models.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(/* your database config */);

// Define Phase Model
const Phase = sequelize.define('Phase', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'phases',
});

// Define Step Model
const Step = sequelize.define('Step', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    stepNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
}, {
    timestamps: true,
    tableName: 'steps',
});

// Define LearningObjective Model
const LearningObjective = sequelize.define('LearningObjective', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        // If you want to set IDs manually, ensure autoIncrement is disabled
        // autoIncrement: true,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phaseId: { // Foreign key to Phase
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Phase,
            key: 'id',
        },
    },
    stepId: { // Foreign key to Step
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Step,
            key: 'id',
        },
    },
    task: { // Additional required field
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'learning_objectives',
});

// Define Checkbox Model
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
    phaseId: { // Foreign key to Phase
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Phase,
            key: 'id',
        },
    },
    stepId: { // Foreign key to Step
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Step,
            key: 'id',
        },
    },
    learningObjectiveId: { // Foreign key to LearningObjective
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: LearningObjective,
            key: 'id',
        },
    },
}, {
    timestamps: true,
    tableName: 'checkboxes',
});

// Define Associations
Phase.hasMany(Step, {
    foreignKey: 'phaseId',
    as: 'steps',
    onDelete: 'CASCADE',
});

Step.belongsTo(Phase, {
    foreignKey: 'phaseId',
    as: 'phase',
});

Step.hasMany(Checkbox, {
    foreignKey: 'stepId',
    as: 'checkboxes',
    onDelete: 'CASCADE',
});

Checkbox.belongsTo(Step, {
    foreignKey: 'stepId',
    as: 'step',
});

LearningObjective.hasMany(Checkbox, {
    foreignKey: 'learningObjectiveId',
    as: 'checkboxes',
    onDelete: 'CASCADE',
});

Checkbox.belongsTo(LearningObjective, {
    foreignKey: 'learningObjectiveId',
    as: 'learningObjective',
});

// Synchronize the models with the database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized successfully.');
    })
    .catch((error) => {
        console.error('Error synchronizing the database:', error);
    });

// Export the models and sequelize instance
module.exports = {
    Phase,
    Step,
    Checkbox,
    LearningObjective,
    sequelize,
};