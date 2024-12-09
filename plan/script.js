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
    const phaseHeadings = document.querySelectorAll('.phase-box h3');
    phaseHeadings.forEach(heading => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('phase-checkbox');
        heading.prepend(checkbox);
    });

    // Add smaller checkboxes for each step within the phases
    const phaseSteps = document.querySelectorAll('.phase-box ul li');
    phaseSteps.forEach(step => {
        const stepCheckbox = document.createElement('input');
        stepCheckbox.type = 'checkbox';
        stepCheckbox.classList.add('step-checkbox');
        step.insertBefore(stepCheckbox, step.firstChild);
    });
});

