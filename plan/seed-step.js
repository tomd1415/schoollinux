// seed-steps.js

const { Step, Phase, sequelize } = require('./models');

const steps = [
    // Phase 1 Steps
    {
        stepId: 'sub-step-1-1',
        name: 'Network Isolation (VLAN/Subnet)',
        phaseName: 'Phase 1',
    },
    {
        stepId: 'sub-step-1-2',
        name: 'Configure DHCP with dnsmasq',
        phaseName: 'Phase 1',
    },
    // Phase 2 Steps
    {
        stepId: 'sub-step-2-1',
        name: 'Deploy Debian using PXE booting',
        phaseName: 'Phase 2',
    },
    {
        stepId: 'sub-step-2-2',
        name: 'Set up Ansible for automation',
        phaseName: 'Phase 2',
    },
    // Phase 3 Steps
    {
        stepId: 'sub-step-3-1',
        name: 'Validate user logins and file access',
        phaseName: 'Phase 3',
    },
    {
        stepId: 'sub-step-3-2',
        name: 'Monitor system performance',
        phaseName: 'Phase 3',
    },
    // Phase 4 Steps
    {
        stepId: 'sub-step-4-1',
        name: 'Analyze user feedback and issue reports',
        phaseName: 'Phase 4',
    },
    {
        stepId: 'sub-step-4-2',
        name: 'Review performance and logs',
        phaseName: 'Phase 4',
    },
    // Phase Index Steps
    {
        stepId: 'phase-1',
        name: 'Phase 1 Overview',
        phaseName: 'Phase 1',
    },
    {
        stepId: 'phase-2',
        name: 'Phase 2 Overview',
        phaseName: 'Phase 2',
    },
    {
        stepId: 'phase-3',
        name: 'Phase 3 Overview',
        phaseName: 'Phase 3',
    },
    {
        stepId: 'phase-4',
        name: 'Phase 4 Overview',
        phaseName: 'Phase 4',
    },
];

async function seedSteps() {
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully.');

        // Force synchronize models with the database (drops existing tables)
        await sequelize.sync({ force: true });
        console.log('Database synchronized.');

        for (const step of steps) {
            // Find or create Phase
            const [phase, created] = await Phase.findOrCreate({
                where: { name: step.phaseName },
                defaults: { name: step.phaseName },
            });

            // Find or create Step
            await Step.findOrCreate({
                where: { stepId: step.stepId },
                defaults: {
                    name: step.name,
                    phaseId: phase.id,
                },
            });
        }

        console.log('Steps seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedSteps();