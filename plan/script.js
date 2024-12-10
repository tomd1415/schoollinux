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

    // Add checkboxes for phases (existing functionality)
    const phaseHeadings = document.querySelectorAll('.phase-box');
    phaseHeadings.forEach((phaseBox, phaseIndex) => {
        const phaseId = `phase-${phaseIndex + 1}`;
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
            const stepId = `step-${phaseIndex + 1}-${stepIndex + 1}`;
            
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
            data.forEach(checkbox => {
                const checkboxElement = document.querySelector(`input[data-id="checkbox-${checkbox.id}"]`);
                if (checkboxElement) {
                    checkboxElement.checked = checkbox.is_completed;
                }
            });
        })
        .catch(error => console.error('Error fetching checkboxes:', error));
}

// Function to update completion status
function updateCompletionStatus(id, isChecked, type, parentId = null) {
    const parsedId = parseId(id, type);
    const checkboxId = parsedId.databaseId;

    fetch(`/api/checkboxes/${checkboxId}`, {
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

// Helper function to parse the data-id and extract the database ID
function parseId(id, type) {
    // Example patterns:
    // phase-1
    // step-1-1
    // sub-step-1-1-1
    const parts = id.split('-');
    let databaseId = null;

    if (type === 'phase') {
        // Assuming phaseIndex corresponds to phase ID in DB
        databaseId = parseInt(parts[1], 10);
    } else if (type === 'step') {
        // Assuming stepIndex corresponds to step ID in DB
        // This might need adjustment based on actual DB IDs
        databaseId = parseInt(parts[2], 10);
    } else if (type === 'checkbox') {
        databaseId = parseInt(parts[1], 10);
    }

    return { databaseId };
}

// Function to check and update phase completion based on its steps
function checkPhaseCompletion(phaseId) {
    const phaseBox = document.querySelector(`[data-id="${phaseId}"]`).parentElement;
    const stepCheckboxes = phaseBox.querySelectorAll('.step-checkbox');
    const allStepsCompleted = Array.from(stepCheckboxes).every(checkbox => checkbox.checked);

    const phaseCheckbox = phaseBox.querySelector('.phase-checkbox');
    if (allStepsCompleted) {
        phaseCheckbox.checked = true;
        updateCompletionStatus(phaseId, true, 'phase');
    } else {
        phaseCheckbox.checked = false;
        updateCompletionStatus(phaseId, false, 'phase');
    }
}