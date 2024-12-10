// seed.js

const { Phase, Step, Checkbox, LearningObjective, sequelize } = require('./models');

// Define the checkbox data
const checkboxData = [
    // ... your existing checkbox data
];

// Function to seed phases
async function seedPhases() {
    const phases = [
        { phaseNumber: 1, name: 'Phase 1: Preparation' },
        { phaseNumber: 2, name: 'Phase 2: Implementation' },
        { phaseNumber: 3, name: 'Phase 3: Testing' },
        { phaseNumber: 4, name: 'Phase 4: Evaluation' },
    ];

    for (const phase of phases) {
        const [ph, created] = await Phase.findOrCreate({
            where: { phaseNumber: phase.phaseNumber },
            defaults: {
                name: phase.name,
                phaseNumber: phase.phaseNumber,
            },
        });
        if (created) {
            console.log(`Created Phase: ${ph.name}`);
        } else {
            console.log(`Phase already exists: ${ph.name}`);
        }
    }
}

// Function to seed steps
async function seedSteps() {
    const steps = [
        // ... your steps data
    ];

    for (const stepObj of steps) {
        const phase = await Phase.findOne({ where: { phaseNumber: stepObj.phaseNumber } });
        if (!phase) {
            console.warn(`Phase with number ${stepObj.phaseNumber} not found for Step "${stepObj.name}"`);
            continue;
        }

        const [step, created] = await Step.findOrCreate({
            where: {
                phaseId: phase.id,
                stepNumber: stepObj.stepNumber,
            },
            defaults: {
                name: stepObj.name,
                stepNumber: stepObj.stepNumber,
                phaseId: phase.id,
            },
        });

        if (created) {
            console.log(`Created Step "${step.name}" in Phase ID ${phase.id}`);
        } else {
            console.log(`Step already exists "${step.name}" in Phase ID ${phase.id}`);
        }
    }
}

// Function to seed learning objectives
async function seedLearningObjectives() {
    const learningObjectives = [
        // ... your learning objectives data
    ];

    for (const obj of learningObjectives) {
        // ... your seeding logic
    }
}

// Function to seed checkboxes
async function seedCheckboxes() {
    for (const checkbox of checkboxData) {
        // ... your seeding logic
    }
}

// Function to seed all data
async function seedAll() {
    try {
        // Synchronize models with database
        await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
        console.log('Database synchronized successfully.');

        // Authenticate connection
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Seed data
        await seedPhases();
        await seedSteps();
        await seedLearningObjectives();
        await seedCheckboxes();

        console.log('All seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

// Execute the seed function
seedAll();