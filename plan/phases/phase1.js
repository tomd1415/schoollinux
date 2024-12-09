// Phase 1 specific JavaScript
// For example, you can add code to save comments or manage checkboxes if needed.

document.addEventListener('DOMContentLoaded', () => {
    const commentsBox = document.getElementById("phase1-comments-box");

    // Load existing comments from local storage if available
    const savedComments = localStorage.getItem("phase1-comments");
    if (savedComments) {
        commentsBox.value = savedComments;
    }

    // Save comments to local storage whenever the user types
    commentsBox.addEventListener("input", () => {
        localStorage.setItem("phase1-comments", commentsBox.value);
    });
});

