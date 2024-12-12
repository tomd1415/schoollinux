// seed-cb.js

const { Checkbox, sequelize } = require('./models');

const checkboxes = [
    // Phase 1 Checkboxes
    {
        label: 'Configure a VLAN/subnet on your switch and server to host the 20 pilot machines.',
        stepId: 'sub-step-1-1',
        is_completed: false
    },
    {
        label: 'Install and configure dnsmasq for DHCP.',
        stepId: 'sub-step-1-2',
        is_completed: false
    },
    // Phase 2 Checkboxes
    {
        label: 'Deploy Debian using PXE booting.',
        stepId: 'sub-step-2-1',
        is_completed: false
    },
    {
        label: 'Set up Ansible for automation.',
        stepId: 'sub-step-2-2',
        is_completed: false
    },
    // Phase 3 Checkboxes
    {
        label: 'Validate user logins and file access.',
        stepId: 'sub-step-3-1',
        is_completed: false
    },
    {
        label: 'Monitor system performance.',
        stepId: 'sub-step-3-2',
        is_completed: false
    },
    // Phase 4 Checkboxes
    {
        label: 'Analyze user feedback and issue reports.',
        stepId: 'sub-step-4-1',
        is_completed: false
    },
    {
        label: 'Review performance and logs.',
        stepId: 'sub-step-4-2',
        is_completed: false
    },
    // Index Page Checkboxes
    {
        label: 'Phase 1',
        stepId: 'phase-1',
        is_completed: false
    },
    {
        label: 'Phase 2',
        stepId: 'phase-2',
        is_completed: false
    },
    {
        label: 'Phase 3',
        stepId: 'phase-3',
        is_completed: false
    },
    {
        label: 'Phase 4',
        stepId: 'phase-4',
        is_completed: false
    },
];

async function seedCheckboxes() {
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully.');

        // Synchronize models without dropping tables
        // Since seed-steps.js has already created the tables, we don't need to sync here
        // However, to ensure that Checkboxes table exists, we'll sync without force or alter
        await sequelize.sync();
        console.log('Database synchronized.');

        await Checkbox.bulkCreate(checkboxes, { ignoreDuplicates: true });
        console.log('Checkboxes seeded successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedCheckboxes();