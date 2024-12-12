// script.js

document.addEventListener('DOMContentLoaded', () => {
    const commentsBox = document.getElementById("comments-box");
    const savedComments = localStorage.getItem("global-comments");

    if (savedComments) {
        commentsBox.value = savedComments;
    }

    commentsBox.addEventListener("input", () => {
        localStorage.setItem("global-comments", commentsBox.value);
    });

    // Fetch and render checkboxes
    fetchCheckboxes();

    // Add checkboxes for phases
    const phaseBoxes = document.querySelectorAll('.phase-box');
    phaseBoxes.forEach((phaseBox, phaseIndex) => {
        const phaseNumber = phaseIndex + 1;
        const phaseId = `phase-${phaseNumber}`; // Match data-id format in index.html
        const heading = phaseBox.querySelector('h3');

        // Create and prepend phase checkbox with data-id
        const phaseCheckbox = document.createElement('input');
        phaseCheckbox.type = 'checkbox';
        phaseCheckbox.classList.add('phase-checkbox');
        phaseCheckbox.setAttribute('data-id', phaseId);
        heading.prepend(phaseCheckbox);

        // Add event listener for phase checkbox
        phaseCheckbox.addEventListener('change', (e) => {
            updateCompletionStatus(phaseId, e.target.checked, 'phase');
        });

        // Add checkboxes for each step within the phase
        const stepItems = phaseBox.querySelectorAll('ul li');
        stepItems.forEach((stepItem, stepIndex) => {
            const stepNumber = stepIndex + 1;
            const stepId = `step-${phaseNumber}-${stepNumber}`; // Match data-id format in index.html

            // Create and prepend step checkbox with data-id
            const stepCheckbox = document.createElement('input');
            stepCheckbox.type = 'checkbox';
            stepCheckbox.classList.add('step-checkbox');
            stepCheckbox.setAttribute('data-id', stepId);
            stepItem.prepend(stepCheckbox);

            // Add event listener for step checkbox
            stepCheckbox.addEventListener('change', (e) => {
                updateCompletionStatus(stepId, e.target.checked, 'step', phaseId);
            });
        });
    });
});

// Function to fetch checkboxes from the server and render them
function fetchCheckboxes() {
    fetch('/api/checkboxes')
        .then(response => response.json())
        .then(data => {
            // Initialize objects to track substeps, steps, and phases
            const substepsByStep = {};
            const stepsCompleted = {};
            const phasesCompleted = {};

            data.forEach(checkbox => {
                const stepId = checkbox.stepId;

                // Check if the stepId is a sub-step, e.g., 'sub-step-1-1-1'
                const substepMatch = /^sub-step-(\d+)-(\d+)-(\d+)$/.exec(stepId);
                if (substepMatch) {
                    const phaseNum = substepMatch[1];
                    const stepNum = substepMatch[2];
                    const stepKey = `step-${phaseNum}-${stepNum}`;

                    // Initialize arrays to store substeps for each step
                    if (!substepsByStep[stepKey]) {
                        substepsByStep[stepKey] = [];
                    }
                    substepsByStep[stepKey].push(checkbox);
                }

                // Check if the stepId is a step, e.g., 'step-1-1'
                const stepMatch = /^step-(\d+)-(\d+)$/.exec(stepId);
                if (stepMatch) {
                    const stepKey = stepId;
                    stepsCompleted[stepKey] = checkbox.is_completed;

                    // Update individual step checkbox if it exists on the page
                    const stepCheckbox = document.querySelector(`input[data-id="${stepKey}"]`);
                    if (stepCheckbox) {
                        stepCheckbox.checked = checkbox.is_completed;
                    }
                }

                // Check if the stepId is a phase, e.g., 'phase-1'
                if (stepId.startsWith('phase-')) {
                    const phaseKey = stepId;
                    phasesCompleted[phaseKey] = checkbox.is_completed;

                    // Update individual phase checkbox if it exists on the page
                    const phaseCheckbox = document.querySelector(`input[data-id="${phaseKey}"]`);
                    if (phaseCheckbox) {
                        phaseCheckbox.checked = checkbox.is_completed;
                    }
                }
            });

            // Determine if all substeps in a step are completed
            Object.keys(substepsByStep).forEach(stepKey => {
                const allSubstepsCompleted = substepsByStep[stepKey].every(substep => substep.is_completed);
                stepsCompleted[stepKey] = allSubstepsCompleted;

                // Update step checkbox
                const stepCheckbox = document.querySelector(`input[data-id="${stepKey}"]`);
                if (stepCheckbox) {
                    stepCheckbox.checked = allSubstepsCompleted;
                }

                // Optionally, update the step's completion status on the server
                updateCompletionStatus(stepKey, allSubstepsCompleted, 'step');
            });

            // Determine if all steps in a phase are completed
            const phaseBoxes = document.querySelectorAll('.phase-box');
            phaseBoxes.forEach((phaseBox, phaseIndex) => {
                const phaseNumber = phaseIndex + 1;
                const phaseKey = `phase-${phaseNumber}`;
                const stepCheckboxes = phaseBox.querySelectorAll('.step-checkbox');

                const allStepsCompleted = Array.from(stepCheckboxes).every(stepCheckbox => stepCheckbox.checked);

                phasesCompleted[phaseKey] = allStepsCompleted;

                // Update phase checkbox
                const phaseCheckbox = phaseBox.querySelector(`input[data-id="${phaseKey}"]`);
                if (phaseCheckbox) {
                    phaseCheckbox.checked = allStepsCompleted;
                }

                // Optionally, update the phase's completion status on the server
                updateCompletionStatus(phaseKey, allStepsCompleted, 'phase');
            });
        })
        .catch(error => console.error('Error fetching checkboxes:', error));
}

// Function to update completion status
function updateCompletionStatus(id, isChecked, type, parentId = null) {
    const databaseId = id; // Use the id directly as the stepId

    fetch(`/api/checkboxes/${encodeURIComponent(databaseId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: isChecked }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(`${type} updated:`, data);
        // Optionally, update parent status if step is part of a phase
        if (type === 'step' && parentId) {
            checkPhaseCompletion(parentId);
        }
    })
    .catch(error => console.error(`Error updating ${type}:`, error));
}

// Function to check and update phase completion based on its steps
function checkPhaseCompletion(phaseId) {
    const phaseBox = document.querySelector(`input[data-id="${phaseId}"]`).closest('.phase-box');
    const stepCheckboxes = phaseBox.querySelectorAll('.step-checkbox');
    const allStepsCompleted = Array.from(stepCheckboxes).every(checkbox => checkbox.checked);

    const phaseCheckbox = phaseBox.querySelector('.phase-checkbox');
    if (phaseCheckbox) {
        phaseCheckbox.checked = allStepsCompleted;
        updateCompletionStatus(phaseId, allStepsCompleted, 'phase');
    }
}