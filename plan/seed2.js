// seed.js

const { Sequelize, DataTypes } = require('sequelize');
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
    {
        dataId: 'phase-2',
        label: 'Phase 2: Implementation',
        relation: 'phase',
        phaseNumber: 2,
    },
    {
        dataId: 'phase-3',
        label: 'Phase 3: Testing',
        relation: 'phase',
        phaseNumber: 3,
    },
    {
        dataId: 'phase-4',
        label: 'Phase 4: Evaluation',
        relation: 'phase',
        phaseNumber: 4,
    },

    // Phase 1 Steps
    {
        dataId: 'step-1-1',
        label: 'Step 1: Configure a dedicated subnet and VLAN.',
        relation: 'step',
        phaseNumber: 1,
        stepNumber: 1,
    },
    {
        dataId: 'step-1-2',
        label: 'Step 2: Set up a central file server using Samba/Winbind integrated with AD.',
        relation: 'step',
        phaseNumber: 1,
        stepNumber: 2,
    },
    {
        dataId: 'step-1-4',
        label: 'Step 4: Install and configure Ansible on a control machine.',
        relation: 'step',
        phaseNumber: 1,
        stepNumber: 4,
    },
    {
        dataId: 'step-1-5',
        label: 'Step 5: Verify basic connectivity and domain integration.',
        relation: 'step',
        phaseNumber: 1,
        stepNumber: 5,
    },

    // Phase 1 Sub-Steps
    {
        dataId: 'sub-step-1-2-3',
        label: 'Join the server to the AD domain and verify domain users visibility.',
        relation: 'step',
        phaseNumber: 1,
        stepNumber: 2,
    },
    {
        dataId: 'sub-step-1-2-4',
        label: 'Set up the [homes] share to serve user home directories.',
        relation: 'step',
        phaseNumber: 1,
        stepNumber: 2,
    },
    {
        dataId: 'sub-step-1-4-3',
        label: 'Set up SSH key-based authentication to all machines.',
        relation: 'step',
        phaseNumber: 1,
        stepNumber: 4,
    },
    {
        dataId: 'sub-step-1-5-1',
        label: 'Double-check VLAN isolation.',
        relation: 'step',
        phaseNumber: 1,
        stepNumber: 5,
    },
    {
        dataId: 'sub-step-1-5-2',
        label: 'Confirm Samba/AD integration with `wbinfo -u` and `getent passwd`.',
        relation: 'step',
        phaseNumber: 1,
        stepNumber: 5,
    },
    {
        dataId: 'sub-step-1-5-4',
        label: 'Document any issues and resolve them before Phase 2.',
        relation: 'step',
        phaseNumber: 1,
        stepNumber: 5,
    },

    // Phase 2 Steps
    {
        dataId: 'step-2-1',
        label: 'Step 1: Install Debian via PXE on all machines.',
        relation: 'step',
        phaseNumber: 2,
        stepNumber: 1,
    },
    {
        dataId: 'step-2-2',
        label: 'Step 2: Leverage Ansible to install and configure necessary packages.',
        relation: 'step',
        phaseNumber: 2,
        stepNumber: 2,
    },
    {
        dataId: 'step-2-6',
        label: 'Step 6: Final testing and confirmation.',
        relation: 'step',
        phaseNumber: 2,
        stepNumber: 6,
    },

    // Phase 2 Sub-Steps
    {
        dataId: 'sub-step-2-1-2',
        label: 'Ensure each machine can resolve the file server and AD domain after installation.',
        relation: 'step',
        phaseNumber: 2,
        stepNumber: 1,
    },
    {
        dataId: 'sub-step-2-2-1',
        label: 'Update your Ansible inventory file (created in Phase 1) with all 20 machines.',
        relation: 'step',
        phaseNumber: 2,
        stepNumber: 2,
    },
    {
        dataId: 'sub-step-2-2-2',
        label: 'Create an Ansible playbook to install packages.',
        relation: 'step',
        phaseNumber: 2,
        stepNumber: 2,
    },
    {
        dataId: 'sub-step-2-6-1',
        label: 'Log in as a domain user on multiple machines.',
        relation: 'step',
        phaseNumber: 2,
        stepNumber: 6,
    },
    {
        dataId: 'sub-step-2-6-2',
        label: 'Test file transfers from OneDrive and ensure stable access.',
        relation: 'step',
        phaseNumber: 2,
        stepNumber: 6,
    },

    // Phase 3 Steps
    {
        dataId: 'step-3-1',
        label: 'Step 1: User Authentication Testing.',
        relation: 'step',
        phaseNumber: 3,
        stepNumber: 1,
    },
    {
        dataId: 'step-3-4',
        label: 'Step 4: Error Recording and Feedback Collection.',
        relation: 'step',
        phaseNumber: 3,
        stepNumber: 4,
    },

    // Phase 3 Sub-Steps
    {
        dataId: 'sub-step-3-1-2',
        label: 'Confirm that login times are reasonable and users don’t face delays.',
        relation: 'step',
        phaseNumber: 3,
        stepNumber: 1,
    },
    {
        dataId: 'sub-step-3-1-3',
        label: 'Observe if home directories mount correctly and initial files are accessible.',
        relation: 'step',
        phaseNumber: 3,
        stepNumber: 1,
    },
    {
        dataId: 'sub-step-3-4-2',
        label: 'Record any error messages or unexpected behaviours.',
        relation: 'step',
        phaseNumber: 3,
        stepNumber: 4,
    },
    {
        dataId: 'sub-step-3-4-3',
        label: 'Document suggestions from users on how to improve file access or login procedures.',
        relation: 'step',
        phaseNumber: 3,
        stepNumber: 4,
    },

    // Phase 4 Steps
    {
        dataId: 'step-4-2',
        label: 'Step 2: Log and Performance Evaluation.',
        relation: 'step',
        phaseNumber: 4,
        stepNumber: 2,
    },
    {
        dataId: 'step-4-4',
        label: 'Step 4: Staff Training and Documentation.',
        relation: 'step',
        phaseNumber: 4,
        stepNumber: 4,
    },

    // Phase 4 Sub-Steps
    {
        dataId: 'sub-step-4-2-2',
        label: 'Check Rclone logs for OneDrive performance metrics and errors.',
        relation: 'step',
        phaseNumber: 4,
        stepNumber: 2,
    },
    {
        dataId: 'sub-step-4-2-3',
        label: 'Compare actual login times and file access speeds against your initial benchmarks.',
        relation: 'step',
        phaseNumber: 4,
        stepNumber: 2,
    },
    {
        dataId: 'sub-step-4-4-2',
        label: 'Provide staff with troubleshooting guides and escalation procedures.',
        relation: 'step',
        phaseNumber: 4,
        stepNumber: 4,
    },
    {
        dataId: 'sub-step-4-4-3',
        label: 'Consider short training sessions or video tutorials for end users.',
        relation: 'step',
        phaseNumber: 4,
        stepNumber: 4,
    },

];

// Function to seed phases
async function seedPhases() {
    const phases = [
        { name: 'Phase 1: Preparation' },
        { name: 'Phase 2: Implementation' },
        { name: 'Phase 3: Testing' },
        { name: 'Phase 4: Evaluation' },
    ];

    for (const phase of phases) {
        const [ph, created] = await Phase.findOrCreate({
            where: { name: phase.name },
            defaults: phase,
        });
        if (created) {
            console.log(`Created Phase: ${ph.name}`);
        } else {
            console.log(`Phase already exists: ${ph.name}`);
        }
    }
}

// Function to seed learning objectives
async function seedLearningObjectives() {
    const learningObjectives = [
        { id: 18, label: 'Home Directories & OneDrive Validation: Ensure consistency and cloud access.' },
        { id: 19, label: 'Performance & Reliability Checks: Assess performance under load.' },
        { id: 20, label: 'Feedback & Issue Collection: Gather user input and identify improvements.' },
    ];

    for (const obj of learningObjectives) {
        const [lo, created] = await LearningObjective.findOrCreate({
            where: { id: obj.id },
            defaults: { label: obj.label },
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
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Seed Phases and Learning Objectives first
        await seedPhases();
        await seedLearningObjectives();

        for (const checkbox of checkboxData) {
            if (checkbox.relation === 'learningObjective') {
                // Handle Learning Objective checkboxes
                const learningObjective = await LearningObjective.findByPk(parseInt(checkbox.dataId, 10));
                if (learningObjective) {
                    // Check if the checkbox already exists to prevent duplicates
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
                    console.warn(`Learning Objective with ID ${checkbox.dataId} not found.`);
                }
            } else if (checkbox.relation === 'phase') {
                // Handle Phase checkboxes
                const phase = await Phase.findOne({ where: { name: checkbox.label } });
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
                    console.warn(`Phase with name "${checkbox.label}" not found.`);
                }
            } else if (checkbox.relation === 'step') {
                // Handle Step checkboxes
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

        console.log('Checkbox seeding completed.');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database or seed checkboxes:', error);
        process.exit(1);
    }
}

// Execute the seed function
seedCheckboxes();