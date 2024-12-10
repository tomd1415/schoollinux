// learning-objectives.js

document.addEventListener('DOMContentLoaded', () => {
    fetchObjectives();
});

function fetchObjectives() {
    fetch('/api/learning-objectives')
        .then(response => response.json())
        .then(data => {
            populateObjectives(data);
            attachEventListeners();
        })
        .catch(error => console.error('Error fetching objectives:', error));
}

function populateObjectives(objectives) {
    objectives.forEach(objective => {
        const li = document.querySelector(`li[data-id="${objective.id}"]`);
        if (li) {
            const checkbox = li.querySelector('.objective-checkbox');
            const dateField = li.querySelector('.objective-date');
            const linkField = li.querySelector('.objective-link');
            const commentsField = li.querySelector('.objective-comments');

            if (checkbox) checkbox.checked = objective.is_completed;
            if (dateField) dateField.value = objective.date || '';
            if (linkField) linkField.value = objective.link || '';
            if (commentsField) commentsField.value = objective.comments || '';
        }
    });
}

function attachEventListeners() {
    const objectives = document.querySelectorAll('.objectives-list li');

    objectives.forEach(obj => {
        const id = obj.getAttribute('data-id');
        if (!id) return;

        const checkbox = obj.querySelector('.objective-checkbox');
        const dateField = obj.querySelector('.objective-date');
        const linkField = obj.querySelector('.objective-link');
        const commentsField = obj.querySelector('.objective-comments');

        const debouncedUpdate = debounce(updateObjective, 500);

        if (checkbox) {
            checkbox.addEventListener('change', () => {
                const data = { is_completed: checkbox.checked };
                debouncedUpdate(id, data);
            });
        }

        if (dateField) {
            dateField.addEventListener('input', () => {
                const data = { date: dateField.value };
                debouncedUpdate(id, data);
            });
        }

        if (linkField) {
            linkField.addEventListener('input', () => {
                const data = { link: linkField.value };
                debouncedUpdate(id, data);
            });
        }

        if (commentsField) {
            commentsField.addEventListener('input', () => {
                const data = { comments: commentsField.value };
                debouncedUpdate(id, data);
            });
        }
    });
}

function debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

function updateObjective(id, data) {
    // Convert empty strings to null for 'link' and other optional fields
    if (data.link === '') {
        data.link = null;
    }
    if (data.comments === '') {
        data.comments = null;
    }
    if (data.date === '') {
        data.date = null;
    }

    fetch(`/api/learning-objectives/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 404) {
            // If the record doesn't exist, create a new one
            return createBlankObjective(id)
                .then(() => {
                    // Retry the update after creating the blank record
                    // Again, convert empty strings to null
                    if (data.link === '') {
                        data.link = null;
                    }
                    if (data.comments === '') {
                        data.comments = null;
                    }
                    if (data.date === '') {
                        data.date = null;
                    }
                    return fetch(`/api/learning-objectives/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });
                })
                .then(retryResponse => {
                    if (!retryResponse.ok) {
                        throw new Error('Failed to update objective after creating it.');
                    }
                    return retryResponse.json();
                });
        } else {
            throw new Error('Failed to update objective');
        }
    })
    .then(updatedObjective => {
        console.log('Objective updated:', updatedObjective);
    })
    .catch(error => console.error('Error updating objective:', error));
}

function createBlankObjective(id) {
    const blankData = {
        id: parseInt(id, 10), // Ensure the ID is an integer
        is_completed: false,
        date: null,
        link: null, // Set to null to pass validation
        comments: '',
    };

    return fetch('/api/learning-objectives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blankData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create blank objective');
        }
        return response.json();
    })
    .then(newObjective => {
        console.log('Blank objective created:', newObjective);
    });
}