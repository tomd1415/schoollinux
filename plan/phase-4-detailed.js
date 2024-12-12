/*
document.addEventListener('DOMContentLoaded', () => {
    const commentsBox = document.getElementById("comments-box");
    const savedComments = localStorage.getItem("phase4-detailed-comments");

    if (savedComments) {
        commentsBox.value = savedComments;
    }

    commentsBox.addEventListener("input", () => {
        localStorage.setItem("phase4-detailed-comments", commentsBox.value);
    });

    // Toggle more info boxes
    const infoLinks = document.querySelectorAll('.more-info-link');
    infoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const infoBox = document.getElementById(targetId);
            if (infoBox.style.display === 'block') {
                infoBox.style.display = 'none';
            } else {
                infoBox.style.display = 'block';
            }
        });
    });
});
*/
