// seed.js

const { Phase, Step, Checkbox, LearningObjective, sequelize } = require('./models');

// Define the checkbox data
const checkboxData = [
    // Phase Checkboxes
    {
        dataId: 'phase-1',
        label: 'Phase 1: Preparation',
        relation: 'phase',
        phaseNumber: 1,
    },
    // ... (other checkbox data)
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
        { stepNumber: 1, name: 'Configure a dedicated subnet and VLAN.', phaseNumber: 1 },
        { stepNumber: 2, name: 'Set up a central file server using Samba/Winbind integrated with AD.', phaseNumber: 1 },
        { stepNumber: 4, name: 'Install and configure Ansible on a control machine.', phaseNumber: 1 },
        { stepNumber: 5, name: 'Verify basic connectivity and domain integration.', phaseNumber: 1 },
        { stepNumber: 1, name: 'Install Debian via PXE on all machines.', phaseNumber: 2 },
        { stepNumber: 2, name: 'Leverage Ansible to install and configure necessary packages.', phaseNumber: 2 },
        { stepNumber: 6, name: 'Final testing and confirmation.', phaseNumber: 2 },
        { stepNumber: 1, name: 'User Authentication Testing.', phaseNumber: 3 },
        { stepNumber: 4, name: 'Error Recording and Feedback Collection.', phaseNumber: 3 },
        { stepNumber: 2, name: 'Log and Performance Evaluation.', phaseNumber: 4 },
        { stepNumber: 4, name: 'Staff Training and Documentation.', phaseNumber: 4 },
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
        { id: 18, label: 'Home Directories & OneDrive Validation: Ensure consistency and cloud access.', phaseNumber: 1, stepNumber: 1, task: 'Ensure home directories and OneDrive are correctly set up.' },
        { id: 19, label: 'Performance & Reliability Checks: Assess performance under load.', phaseNumber: 2, stepNumber: 2, task: 'Conduct performance and reliability tests.' },
        { id: 20, label: 'Feedback & Issue Collection: Gather user input and identify improvements.', phaseNumber: 3, stepNumber: 1, task: 'Collect feedback from users and compile issues.' },
    ];

    for (const obj of learningObjectives) {
        const phase = await Phase.findOne({ where: { phaseNumber: obj.phaseNumber } });
        if (!phase) {
            console.warn(`Phase with number ${obj.phaseNumber} not found for Learning Objective ID: ${obj.id}`);
            continue;
        }

        const step = await Step.findOne({
            where: {
                phaseId: phase.id,
                stepNumber: obj.stepNumber,
            },
        });
        if (!step) {
            console.warn(`Step with number ${obj.stepNumber} not found for Learning Objective ID: ${obj.id}`);
            continue;
        }

        const [lo, created] = await LearningObjective.findOrCreate({
            where: { id: obj.id },
            defaults: {
                label: obj.label,
                phaseId: phase.id,
                stepId: step.id,
                task: obj.task,
            },
        });

        if (created) {
            console.log(`Created Learning Objective ID ${lo.id}: ${lo.label}`);
        } else {
            console.log(`Learning Objective already exists ID ${lo.id}: ${lo.label}`);
        }
    }
}

// Function to seed checkboxes
async function seedCheckboxes() {
    for (const checkbox of checkboxData) {
        if (checkbox.relation === 'learningObjective') {
            const learningObjectiveId = parseInt(checkbox.dataId.split('-')[1], 10);
            const learningObjective = await LearningObjective.findByPk(learningObjectiveId);
            if (learningObjective) {
                const existingCheckbox = await Checkbox.findOne({
                    where: {
                        label: checkbox.label,
                        learningObjectiveId: learningObjective.id,
                    },
                });

                if (!existingCheckbox) {
                    await Checkbox.create({
                        label: checkbox.label,
                        is_completed: false,
                        learningObjectiveId: learningObjective.id,
                    });
                    console.log(`Inserted Checkbox for Learning Objective ID: ${learningObjective.id}`);
                } else {
                    console.log(`Checkbox for Learning Objective ID: ${learningObjective.id} already exists.`);
                }
            } else {
                console.warn(`Learning Objective with ID ${learningObjectiveId} not found.`);
            }
        } else if (checkbox.relation === 'phase') {
            const phase = await Phase.findOne({ where: { phaseNumber: checkbox.phaseNumber } });
            if (phase) {
                const existingCheckbox = await Checkbox.findOne({
                    where: {
                        label: checkbox.label,
                        phaseId: phase.id,
                    },
                });

                if (!existingCheckbox) {
                    await Checkbox.create({
                        label: checkbox.label,
                        is_completed: false,
                        phaseId: phase.id,
                    });
                    console.log(`Inserted Checkbox for Phase ID: ${phase.id}`);
                } else {
                    console.log(`Checkbox for Phase ID: ${phase.id} already exists.`);
                }
            } else {
                console.warn(`Phase with number ${checkbox.phaseNumber} not found for Checkbox ID: ${checkbox.dataId}`);
            }
        } else if (checkbox.relation === 'step') {
            const phase = await Phase.findOne({ where: { phaseNumber: checkbox.phaseNumber } });
            if (!phase) {
                console.warn(`Phase with number ${checkbox.phaseNumber} not found for Checkbox ID: ${checkbox.dataId}`);
                continue;
            }

            const step = await Step.findOne({
                where: {
                    phaseId: phase.id,
                    stepNumber: checkbox.stepNumber,
                },
            });

            if (step) {
                const existingCheckbox = await Checkbox.findOne({
                    where: {
                        label: checkbox.label,
                        stepId: step.id,
                    },
                });

                if (!existingCheckbox) {
                    await Checkbox.create({
                        label: checkbox.label,
                        is_completed: false,
                        stepId: step.id,
                    });
                    console.log(`Inserted Checkbox for Step ID: ${step.id}`);
                } else {
                    console.log(`Checkbox for Step ID: ${step.id} already exists.`);
                }
            } else {
                console.warn(`Step with number ${checkbox.stepNumber} not found for Checkbox ID: ${checkbox.dataId}`);
            }
        } else {
            console.warn(`Unknown relation type for Checkbox ID: ${checkbox.dataId}`);
        }
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