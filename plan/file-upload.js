// plan/phases.js or plan/file-upload.js

function uploadFile(phase, step) {
    const fileInput = document.getElementById(`file-upload-${phase}-${step}`);
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('phase', phase);
    formData.append('step', step);
  
    fetch('/api/upload-file', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        loadUploadedFiles(phase, step);
      })
      .catch(err => console.error(err));
  }
  
  function loadUploadedFiles(phase, step) {
    fetch(`/api/get-files?phase=${phase}&step=${encodeURIComponent(step)}`)
      .then(response => response.json())
      .then(files => {
        const filesContainer = document.getElementById(`uploaded-files-${phase}-${step}`);
        filesContainer.innerHTML = '';
        files.forEach(file => {
          const link = document.createElement('a');
          link.href = file.filepath;
          link.textContent = file.filename;
          link.target = '_blank';
          filesContainer.appendChild(link);
          filesContainer.appendChild(document.createElement('br'));
        });
      })
      .catch(err => console.error(err));
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // Load existing files for each step
    const steps = document.querySelectorAll('.step-box');
    steps.forEach(stepBox => {
      const phaseMatch = document.title.match(/Phase (\d)/);
      const phase = phaseMatch ? phaseMatch[1] : '1';
      const step = stepBox.querySelector('h3').innerText;
      loadUploadedFiles(phase, step);
    });
  });