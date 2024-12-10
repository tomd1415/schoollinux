// models2.js

const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize and connect to PostgreSQL
const sequelize = new Sequelize('postgres://setup_linux:exhall2024@localhost:5432/setup_linux_notes', {
    dialect: 'postgres',
    logging: false, // Disable logging; enable if needed for debugging
});

// Define Phase model
const Phase = sequelize.define('Phase', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phaseNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'phases',
    timestamps: true,
});

// Define Step model
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
    tableName: 'steps',
    timestamps: true,
});

// Define LearningObjective model
const LearningObjective = sequelize.define('LearningObjective', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    task: {
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
    stepId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Step,
            key: 'id',
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
    tableName: 'learning_objectives',
    timestamps: true,
});

// Define Checkbox model
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
    phaseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Phase,
            key: 'id',
        },
    },
    stepId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Step,
            key: 'id',
        },
    },
    learningObjectiveId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: LearningObjective,
            key: 'id',
        },
    },
}, {
    tableName: 'checkboxes',
    timestamps: true,
});

// Define Files model
const Files = sequelize.define('Files', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phase: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    step: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    upload_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'files',
    timestamps: true,
});

// Define Notes model
const Notes = sequelize.define('Notes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phase: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Phase,
            key: 'id',
        },
    },
    step: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'notes',
    timestamps: true,
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

// Phase hasMany LearningObjectives
Phase.hasMany(LearningObjective, {
    foreignKey: 'phaseId',
    as: 'learningObjectives',
    onDelete: 'CASCADE',
});

// LearningObjective belongsTo Phase
LearningObjective.belongsTo(Phase, {
    foreignKey: 'phaseId',
    as: 'phase',
});

// Step hasMany LearningObjectives
Step.hasMany(LearningObjective, {
    foreignKey: 'stepId',
    as: 'learningObjectives',
    onDelete: 'CASCADE',
});

// LearningObjective belongsTo Step
LearningObjective.belongsTo(Step, {
    foreignKey: 'stepId',
    as: 'step',
});

// Phase hasMany Checkboxes
Phase.hasMany(Checkbox, {
    foreignKey: 'phaseId',
    as: 'checkboxes',
    onDelete: 'CASCADE',
});

// Checkbox belongsTo Phase
Checkbox.belongsTo(Phase, {
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

// LearningObjective hasMany Checkboxes
LearningObjective.hasMany(Checkbox, {
    foreignKey: 'learningObjectiveId',
    as: 'checkboxes',
    onDelete: 'CASCADE',
});

// Checkbox belongsTo LearningObjective
Checkbox.belongsTo(LearningObjective, {
    foreignKey: 'learningObjectiveId',
    as: 'learningObjective',
});

// File Associations (if any)
// Define if Files are associated with specific models

// Export Models and Sequelize Instance
module.exports = {
    Phase,
    Step,
    LearningObjective,
    Checkbox,
    Files,
    Notes,
    sequelize,
};