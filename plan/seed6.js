// seed.js

const { Sequelize, DataTypes } = require('sequelize');

// Connect to PostgreSQL
const sequelize = new Sequelize('postgres://setup_linux:exhall2024@localhost:5432/setup_linux_notes', {
    dialect: 'postgres',
    logging: false,
});

// Define models

// Phase model
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

// Step model
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
        references: {
            model: Phase,
            key: 'id',
        },
        allowNull: false,
    },
}, {
    tableName: 'steps',
    timestamps: true,
});

// LearningObjective model
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
        references: {
            model: Phase,
            key: 'id',
        },
        allowNull: false,
    },
    stepId: {
        type: DataTypes.INTEGER,
        references: {
            model: Step,
            key: 'id',
        },
        allowNull: false,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'learning_objectives',
    timestamps: true,
});

// Checkbox model
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
        references: {
            model: Phase,
            key: 'id',
        },
        allowNull: true,
    },
    stepId: {
        type: DataTypes.INTEGER,
        references: {
            model: Step,
            key: 'id',
        },
        allowNull: true,
    },
    learningObjectiveId: {
        type: DataTypes.INTEGER,
        references: {
            model: LearningObjective,
            key: 'id',
        },
        allowNull: true,
    },
}, {
    tableName: 'checkboxes',
    timestamps: true,
});

// Define associations
Phase.hasMany(Step, { foreignKey: 'phaseId' });
Step.belongsTo(Phase, { foreignKey: 'phaseId' });

Phase.hasMany(LearningObjective, { foreignKey: 'phaseId' });
LearningObjective.belongsTo(Phase, { foreignKey: 'phaseId' });

Step.hasMany(LearningObjective, { foreignKey: 'stepId' });
LearningObjective.belongsTo(Step, { foreignKey: 'stepId' });

Phase.hasMany(Checkbox, { foreignKey: 'phaseId' });
Checkbox.belongsTo(Phase, { foreignKey: 'phaseId' });

Step.hasMany(Checkbox, { foreignKey: 'stepId' });
Checkbox.belongsTo(Step, { foreignKey: 'stepId' });

LearningObjective.hasMany(Checkbox, { foreignKey: 'learningObjectiveId' });
Checkbox.belongsTo(LearningObjective, { foreignKey: 'learningObjectiveId' });

// Seed data

const phases = [
    { phaseNumber: 1, name: 'Phase 1: Preparation' },
    { phaseNumber: 2, name: 'Phase 2: Implementation' },
    { phaseNumber: 3, name: 'Phase 3: Testing' },
    { phaseNumber: 4, name: 'Phase 4: Evaluation' },
];

const steps = [
    { stepNumber: 1, name: 'Configure a dedicated subnet and VLAN.', phaseNumber: 1 },
    { stepNumber: 2, name: 'Set up a central file server using Samba/Winbind integrated with AD.', phaseNumber: 1 },
    // Add other steps as needed
];

const learningObjectives = [
    { id: 18, label: 'Home Directories & OneDrive Validation', phaseNumber: 1, stepNumber: 1, task: 'Ensure home directories and OneDrive are correctly set up.' },
    { id: 19, label: 'Performance & Reliability Checks', phaseNumber: 2, stepNumber: 2, task: 'Conduct performance and reliability tests.' },
    // Add other learning objectives as needed
];

const checkboxData = [
    // Add your checkbox data here
];

// Seed functions

async function seedPhases() {
    for (const phase of phases) {
        await Phase.findOrCreate({
            where: { phaseNumber: phase.phaseNumber },
            defaults: {
                name: phase.name,
            },
        });
    }
}

async function seedSteps() {
    for (const stepObj of steps) {
        const phase = await Phase.findOne({ where: { phaseNumber: stepObj.phaseNumber } });
        if (!phase) continue;

        await Step.findOrCreate({
            where: {
                phaseId: phase.id,
                stepNumber: stepObj.stepNumber,
            },
            defaults: {
                name: stepObj.name,
                phaseId: phase.id,
            },
        });
    }
}

async function seedLearningObjectives() {
    for (const obj of learningObjectives) {
        const phase = await Phase.findOne({ where: { phaseNumber: obj.phaseNumber } });
        const step = await Step.findOne({ where: { stepNumber: obj.stepNumber, phaseId: phase.id } });

        if (!phase || !step) continue;

        await LearningObjective.findOrCreate({
            where: { id: obj.id },
            defaults: {
                label: obj.label,
                task: obj.task,
                phaseId: phase.id,
                stepId: step.id,
            },
        });
    }
}

async function seedCheckboxes() {
    for (const checkbox of checkboxData) {
        // Implement checkbox seeding logic based on your data
    }
}

async function seedAll() {
    try {
        await sequelize.sync({ force: true });
        await seedPhases();
        await seedSteps();
        await seedLearningObjectives();
        await seedCheckboxes();
        console.log('All data seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedAll();