document.addEventListener('DOMContentLoaded', () => {
    const objectives = document.querySelectorAll('.objectives-list li');

    objectives.forEach((obj, index) => {
        // Get elements within each objective
        const checkbox = obj.querySelector('.objective-checkbox');
        const dateField = obj.querySelector('.objective-date');
        const linkField = obj.querySelector('.objective-link');
        const commentsField = obj.querySelector('.objective-comments');

        // If elements exist (some objectives might not have all fields, but they should here)
        if (checkbox) {
            const savedChecked = localStorage.getItem(`objective-checked-${index}`);
            if (savedChecked === 'true') checkbox.checked = true;

            checkbox.addEventListener('change', () => {
                localStorage.setItem(`objective-checked-${index}`, checkbox.checked);
            });
        }

        if (dateField) {
            const savedDate = localStorage.getItem(`objective-date-${index}`);
            if (savedDate) dateField.value = savedDate;

            dateField.addEventListener('input', () => {
                localStorage.setItem(`objective-date-${index}`, dateField.value);
            });
        }

        if (linkField) {
            const savedLink = localStorage.getItem(`objective-link-${index}`);
            if (savedLink) linkField.value = savedLink;

            linkField.addEventListener('input', () => {
                localStorage.setItem(`objective-link-${index}`, linkField.value);
            });
        }

        if (commentsField) {
            const savedComments = localStorage.getItem(`objective-comments-${index}`);
            if (savedComments) commentsField.value = savedComments;

            commentsField.addEventListener('input', () => {
                localStorage.setItem(`objective-comments-${index}`, commentsField.value);
            });
        }
    });
});
