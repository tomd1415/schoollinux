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

        const handleChange = () => {
            const data = {
                id: parseInt(id, 10),
                is_completed: checkbox.checked,
                date: dateField.value || null,
                link: linkField.value || null,
                comments: commentsField.value || null,
            };
            debouncedUpdate(id, data);
        };

        if (checkbox) checkbox.addEventListener('change', handleChange);
        if (dateField) dateField.addEventListener('input', handleChange);
        if (linkField) linkField.addEventListener('input', handleChange);
        if (commentsField) commentsField.addEventListener('input', handleChange);
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
    fetch(`/api/learning-objectives/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update objective');
        }
        return response.json();
    })
    .then(updatedObjective => {
        console.log('Objective updated:', updatedObjective);
    })
    .catch(error => console.error('Error updating objective:', error));
}