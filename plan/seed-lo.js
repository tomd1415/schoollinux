// seed-lo.js

const { LearningObjective, Phase, Step, sequelize } = require('./models');

const learningObjectives = [
    {
        id: 1,
        label: 'Network and Systems Understanding',
        task: 'Understand networks, servers, and authentication systems.',
        phaseName: 'Phase 1',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 2,
        label: 'Linux and Open-Source Competency',
        task: 'Work confidently with Linux and open-source tools.',
        phaseName: 'Phase 1',
        stepName: 'Step 2',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 3,
        label: 'Configuration Management and Automation',
        task: 'Use tools like Ansible for consistent deployments.',
        phaseName: 'Phase 2',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 4,
        label: 'Performance and Usability Considerations',
        task: 'Evaluate system performance and user feedback.',
        phaseName: 'Phase 2',
        stepName: 'Step 2',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 5,
        label: 'Documentation and Professional Practices',
        task: 'Apply version control, documentation, and reporting.',
        phaseName: 'Phase 3',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 6,
        label: 'Network Segmentation and DHCP',
        task: 'Implement VLANs/subnets and configure DHCP.',
        phaseName: 'Phase 1',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 7,
        label: 'Centralised File Services',
        task: 'Set up Samba/Winbind integrated with AD.',
        phaseName: 'Phase 1',
        stepName: 'Step 2',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 8,
        label: 'Debian Installation and PXE',
        task: 'Understand PXE booting and Debian installs.',
        phaseName: 'Phase 2',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 9,
        label: 'Configuration Management (Ansible)',
        task: 'Set up Ansible for automation.',
        phaseName: 'Phase 2',
        stepName: 'Step 2',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 10,
        label: 'Verification and Troubleshooting',
        task: 'Verify settings and resolve issues.',
        phaseName: 'Phase 3',
        stepName: 'Step 2',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 11,
        label: 'OS Deployment',
        task: 'Uniformly deploy Debian using PXE.',
        phaseName: 'Phase 2',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 12,
        label: 'Package Installation & Configuration (Ansible)',
        task: 'Install and configure essential packages.',
        phaseName: 'Phase 2',
        stepName: 'Step 2',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 13,
        label: 'AD Domain Integration',
        task: 'Join Linux clients to the AD domain.',
        phaseName: 'Phase 3',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 14,
        label: 'User Home Directories & PAM',
        task: 'Configure PAM for automatic home creation.',
        phaseName: 'Phase 3',
        stepName: 'Step 2',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 15,
        label: 'Cloud Integration (OneDrive)',
        task: 'Use Rclone for OneDrive access.',
        phaseName: 'Phase 3',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 16,
        label: 'Verification Tests',
        task: 'Test configurations for performance and reliability.',
        phaseName: 'Phase 4',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 17,
        label: 'User Experience Testing',
        task: 'Connect configurations to practical classroom use.',
        phaseName: 'Phase 4',
        stepName: 'Step 2',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 18,
        label: 'Home Directories & OneDrive Validation',
        task: 'Ensure consistency and cloud access.',
        phaseName: 'Phase 1',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 19,
        label: 'Performance & Reliability Checks',
        task: 'Assess performance under load.',
        phaseName: 'Phase 2',
        stepName: 'Step 2',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 20,
        label: 'Feedback & Issue Collection',
        task: 'Gather user input and identify improvements.',
        phaseName: 'Phase 3',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 21,
        label: 'Refinements & Adjustments',
        task: 'Apply minor changes to address issues.',
        phaseName: 'Phase 4',
        stepName: 'Step 1',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 22,
        label: 'Feedback Analysis & Prioritisation',
        task: 'Interpret user feedback and prioritise fixes.',
        phaseName: 'Phase 4',
        stepName: 'Step 2',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 23,
        label: 'Performance & Log Review',
        task: 'Compare logs and metrics against benchmarks.',
        phaseName: 'Phase 4',
        stepName: 'Step 3',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 24,
        label: 'Decision Making & Next Steps',
        task: 'Decide on wider rollout or further refinements.',
        phaseName: 'Phase 4',
        stepName: 'Step 4',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
    {
        id: 25,
        label: 'Documentation & Training',
        task: 'Update docs and provide training resources.',
        phaseName: 'Phase 4',
        stepName: 'Step 5',
        is_completed: false,
        date: null,
        link: null,
        comments: '',
    },
];

async function seedLearningObjectives() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Synchronize models
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');

        for (const obj of learningObjectives) {
            // Find the Phase by name
            const phase = await Phase.findOne({ where: { name: obj.phaseName } });
            if (!phase) {
                console.warn(`Phase "${obj.phaseName}" not found for Learning Objective ID: ${obj.id}`);
                continue;
            }

            // Find the Step by name and phaseId
            const step = await Step.findOne({
                where: {
                    name: obj.stepName,
                    phaseId: phase.id,
                },
            });
            if (!step) {
                console.warn(`Step "${obj.stepName}" in Phase "${obj.phaseName}" not found for Learning Objective ID: ${obj.id}`);
                continue;
            }

            // Create the LearningObjective
            const [lo, created] = await LearningObjective.findOrCreate({
                where: { id: obj.id },
                defaults: {
                    label: obj.label,
                    task: obj.task,
                    phaseId: phase.id,
                    stepId: step.id,
                    is_completed: obj.is_completed,
                    date: obj.date,
                    link: obj.link,
                    comments: obj.comments,
                },
            });

            if (created) {
                console.log(`Created Learning Objective ID ${lo.id}: ${lo.label}`);
            } else {
                console.log(`Learning Objective ID ${lo.id} already exists: ${lo.label}`);
            }
        }

        console.log('Seeding learning objectives completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding learning objectives:', error);
        process.exit(1);
    }
}

seedLearningObjectives();