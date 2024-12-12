// phase-1-detailed.js
/*
document.addEventListener('DOMContentLoaded', () => {
    const commentsBox = document.getElementById("comments-box");
    const savedComments = localStorage.getItem("phase1-detailed-comments");

    if (savedComments) {
        commentsBox.value = savedComments;
    }

    commentsBox.addEventListener("input", () => {
        localStorage.setItem("phase1-detailed-comments", commentsBox.value);
    });

    // Toggle more info boxes
    const infoLinks = document.querySelectorAll('.more-info-link');
    infoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const infoBox = document.getElementById(targetId);
            infoBox.style.display = (infoBox.style.display === 'block') ? 'none' : 'block';
        });
    });

    // Handle Checkboxes
    handleCheckboxes();
});
*/
/*
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
                console.log(`Checkbox stepId ${stepId} updated to ${data.is_completed}`);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
} */