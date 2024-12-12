// phases.js

document.addEventListener('DOMContentLoaded', () => {
    // Handle Comments Saving
    handleComments();

    // Toggle More Info Boxes
    handleMoreInfoLinks();

    // Handle Checkboxes
    handleCheckboxes();
});

function handleComments() {
    const commentsBox = document.getElementById("comments-box");
    if (commentsBox) {
        const savedComments = localStorage.getItem(`${document.body.id}-comments`);

        if (savedComments) {
            commentsBox.value = savedComments;
        }

        commentsBox.addEventListener("input", () => {
            localStorage.setItem(`${document.body.id}-comments`, commentsBox.value);
        });
    }
}

function handleMoreInfoLinks() {
    const infoLinks = document.querySelectorAll('.more-info-link');
    infoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const infoBox = document.getElementById(targetId);
            if (infoBox) {
                infoBox.style.display = (infoBox.style.display === 'block') ? 'none' : 'block';
            }
        });
    });
}

function handleCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-id]');

    checkboxes.forEach(checkbox => {
        const stepId = checkbox.dataset.id;

        // Fetch the current state from the server and set the checkbox
        fetch(`/api/checkboxes/${encodeURIComponent(stepId)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch checkbox with stepId ${stepId}`);
                }
                return response.json();
            })
            .then(data => {
                checkbox.checked = data.is_completed;
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Add event listener to update the server when the checkbox is toggled
        checkbox.addEventListener('change', () => {
            const isCompleted = checkbox.checked;

            fetch(`/api/checkboxes/${encodeURIComponent(stepId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_completed: isCompleted }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to update checkbox with stepId ${stepId}`);
                }
                return response.json();
            })
            .then(data => {
                //console.log(`Checkbox stepId ${stepId} updated to ${data.is_completed}`);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
}