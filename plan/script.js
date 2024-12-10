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

    // Add checkboxes for phases
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

// Function to update completion status
function updateCompletionStatus(id, isChecked, type, parentId = null) {
    // Example: Send the update to the server
    fetch(`/api/${type}s/${id}`, {
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