// file-upload.js

function uploadFile(phase, step) {
    const fileInput = document.getElementById(`file-upload-${phase}-${step}`);
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('phase', phase);
    formData.append('step', step);
  
    fetch('/api/upload-file', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(data => {
        console.log(data);
        loadUploadedFiles(phase, step);
        alert("File uploaded successfully.");
      })
      .catch(err => {
        console.error(err);
        alert("Error uploading file.");
      });
}

function loadUploadedFiles(phase, step) {
    fetch(`/api/get-files?phase=${phase}&step=${encodeURIComponent(step)}`)
      .then(response => response.json())
      .then(files => {
        const filesContainer = document.getElementById(`uploaded-files-${phase}-${step}`);
        filesContainer.innerHTML = '';
        if (files.length === 0) {
          filesContainer.innerHTML = '<p>No files uploaded.</p>';
          return;
        }
        files.forEach(file => {
          const fileWrapper = document.createElement('div');
          fileWrapper.style.display = 'flex';
          fileWrapper.style.justifyContent = 'space-between';
          fileWrapper.style.alignItems = 'center';
          fileWrapper.style.marginBottom = '5px';
          
          const link = document.createElement('a');
          link.href = `/${file.filepath}`;
          link.textContent = file.filename;
          link.target = '_blank';
          
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = '✕';
          deleteBtn.style.marginLeft = '10px';
          deleteBtn.style.border = 'none';
          deleteBtn.style.background = 'transparent';
          deleteBtn.style.color = 'red';
          deleteBtn.style.cursor = 'pointer';
          deleteBtn.title = 'Delete file';
          deleteBtn.onclick = () => deleteFile(file.id, phase, step);
          
          fileWrapper.appendChild(link);
          fileWrapper.appendChild(deleteBtn);
          filesContainer.appendChild(fileWrapper);
        });
      })
      .catch(err => console.error(err));
}

function deleteFile(fileId, phase, step) {
    if (!confirm('Are you sure you want to delete this file?')) {
        return;
    }
    
    fetch(`/api/delete-file?id=${fileId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert('File deleted successfully.');
        loadUploadedFiles(phase, step);
    })
    .catch(err => {
        console.error(err);
        alert('Error deleting file.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Load existing files for each step
    const steps = document.querySelectorAll('.step-box');
    steps.forEach(stepBox => {
      const phaseMatch = document.title.match(/Phase (\d)/);
      const phase = phaseMatch ? phaseMatch[1] : '1';
      const stepNumber = stepBox.getAttribute('data-step-number'); // Correct extraction
      loadUploadedFiles(phase, stepNumber);
    });
});