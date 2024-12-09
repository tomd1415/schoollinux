document.addEventListener('DOMContentLoaded', () => {
    const stepBoxes = document.querySelectorAll('.step-box');

    stepBoxes.forEach((box, index) => {
        // Create a container for the notes
        const notesContainer = document.createElement('div');
        notesContainer.classList.add('step-notes-container');

        // Create a label for the textarea
        const label = document.createElement('label');
        label.textContent = 'Notes for this step:';
        label.setAttribute('for', `step-notes-${index}`);

        // Create the textarea
        const textarea = document.createElement('textarea');
        textarea.id = `step-notes-${index}`;
        textarea.placeholder = 'Write your notes here...';

        // Load saved notes from localStorage if available
        const saved = localStorage.getItem(`step-notes-${index}`);
        if (saved) {
            textarea.value = saved;
        }

        // Save notes to localStorage on input
        textarea.addEventListener('input', () => {
            localStorage.setItem(`step-notes-${index}`, textarea.value);
        });

        notesContainer.appendChild(label);
        notesContainer.appendChild(textarea);
        box.appendChild(notesContainer);
    });
});

