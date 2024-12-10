document.addEventListener('DOMContentLoaded', () => {
  const stepBoxes = document.querySelectorAll('.step-box');

  // Debounce function
  function debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }

  stepBoxes.forEach((box) => {
    const phase = document.title.match(/Phase (\d)/)[1];
    const step = box.querySelector('h3').innerText;
    const index = `${phase}-${step}`;

    // Create a container for the notes
    const notesContainer = document.createElement('div');
    notesContainer.classList.add('step-notes-container');

    // Create the textarea
    const textarea = document.createElement('textarea');
    textarea.id = `step-notes-${index}`;
    textarea.placeholder = 'Write your notes here...';

    // Fetch saved notes from the server
    fetch(`/api/get-notes?phase=${phase}&step=${encodeURIComponent(step)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data[0]) {
          textarea.value = data[0].content;
        }
      })
      .catch((err) => console.error(err));

    // Save note function
    function saveNote() {
      fetch('/api/save-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: phase,
          step: step,
          content: textarea.value,
        }),
      })
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }

    // Use debounce to delay saveNote execution
    const debouncedSaveNote = debounce(saveNote, 1000); // Adjust delay as needed

    // Save note on textarea input
    textarea.addEventListener('input', debouncedSaveNote);

    notesContainer.appendChild(textarea);
    box.appendChild(notesContainer);
  });
});

