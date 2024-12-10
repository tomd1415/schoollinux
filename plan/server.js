// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const multer = require('multer');
const fs = require('fs'); // Added for file operations
const upload = multer({ dest: 'uploads/' });
const { LearningObjective, Phase, Step, Checkbox, sequelize } = require('./models');

const app = express();
const pool = new Pool({
  user: 'setup_linux',
  host: 'localhost',
  database: 'setup_linux_notes',
  password: 'exhall2024',
  port: 5432,
});
const PORT = process.env.PORT || 3500;

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files from the 'public' directory
app.use(express.json());


// API endpoint to save notes
app.post('/api/save-note', async (req, res) => {
  const { phase, step, content } = req.body;
  try {
    await pool.query(
      `INSERT INTO notes (phase, step, content)
       VALUES ($1, $2, $3)
       ON CONFLICT (phase, step)
       DO UPDATE SET content = EXCLUDED.content`,
      [phase, step, content]
    );
    res.status(200).send('Note saved');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving note');
  }
});

// API endpoint to get notes
app.get('/api/get-notes', async (req, res) => {
  const { phase, step } = req.query;
  try {
    const result = await pool.query(
      'SELECT content FROM notes WHERE phase = $1 AND step = $2',
      [phase, step]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching notes');
  }
});

// API endpoint to upload files
app.post('/api/upload-file', upload.single('file'), async (req, res) => {
  const { phase, step } = req.body;
  const file = req.file;

  if (!phase || !step || !file) {
    return res.status(400).send('Missing phase, step, or file');
  }

  try {
    // Ensure the (phase, step) exists in notes
    await pool.query(
      `INSERT INTO notes (phase, step, content)
       VALUES ($1, $2, $3)
       ON CONFLICT (phase, step) DO NOTHING`,
      [phase, step, 'Auto-generated note']
    );

    // Insert into files table
    await pool.query(
      `INSERT INTO files (phase, step, filename, filepath)
       VALUES ($1, $2, $3, $4)`,
      [phase, step, file.originalname, file.path]
    );

    res.status(200).send('File uploaded successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
  }
});

// API endpoint to get files for a step
app.get('/api/get-files', async (req, res) => {
  const { phase, step } = req.query;
  try {
    const result = await pool.query(
      'SELECT id, filename, filepath FROM files WHERE phase = $1 AND step = $2',
      [phase, step]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching files');
  }
});

// **New DELETE endpoint to remove files**
app.delete('/api/delete-file', async (req, res) => {
  const { id } = req.query; // Get 'id' from query parameters
  if (!id) {
    return res.status(400).send('Missing file id');
  }

  try {
    // Fetch the file record
    const result = await pool.query(
      'SELECT filepath FROM files WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('File not found');
    }

    const filepath = result.rows[0].filepath;

    // Delete the file from filesystem
    fs.unlink(path.resolve(filepath), (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
        // Optionally, you can choose to handle this differently
      }
    });

    // Delete the record from the database
    await pool.query(
      'DELETE FROM files WHERE id = $1',
      [id]
    );

    res.status(200).send('File deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting file');
  }
});

// **New Download Endpoint**
app.get('/download-file', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Missing file id');
  }

  try {
    // Fetch file details from the database
    const result = await pool.query(
      'SELECT filename, filepath FROM files WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('File not found');
    }

    const { filename, filepath } = result.rows[0];

    // Resolve the absolute path of the file
    const absolutePath = path.resolve(filepath);

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).send('File not found on server');
    }

    // Set headers to prompt download with the original filename
    res.download(absolutePath, filename, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        // Don't send headers since they might have been sent already
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error downloading file');
  }
});


// Get all learning objectives
app.get('/api/learning-objectives', async (req, res) => {
  try {
      const objectives = await LearningObjective.findAll();
      res.json(objectives);
  } catch (error) {
      console.error('Error fetching learning objectives:', error);
      res.status(500).json({ error: 'Failed to fetch learning objectives.' });
  }
});

// Update or create a learning objective
app.put('/api/learning-objectives/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { is_completed, date, link, comments } = req.body;

  try {
      const [objective, created] = await LearningObjective.upsert({
          id,
          is_completed,
          date,
          link,
          comments,
      }, { returning: true });

      res.json(objective);
  } catch (error) {
      console.error('Error updating learning objective:', error);
      res.status(500).json({ error: 'Failed to update learning objective.' });
  }
});

// Serve learning objectives page
app.get('/learning-objectives.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'learning-objectives.html'));
});


// API Endpoints for Checkboxes

// Get all checkboxes
app.get('/api/checkboxes', async (req, res) => {
  try {
    const checkboxes = await Checkbox.findAll({
      include: {
        model: Step,
        as: 'step',
        include: {
          model: Phase,
          as: 'phase',
        },
      },
    });
    res.json(checkboxes);
  } catch (error) {
    console.error('Error fetching checkboxes:', error);
    res.status(500).json({ error: 'Failed to fetch checkboxes.' });
  }
});

// Update a checkbox's completion status
app.put('/api/checkboxes/:id', async (req, res) => {
  const checkboxId = req.params.id;
  const { is_completed } = req.body;

  try {
    const checkbox = await Checkbox.findByPk(checkboxId);
    if (!checkbox) {
      return res.status(404).json({ error: 'Checkbox not found.' });
    }

    checkbox.is_completed = is_completed;
    await checkbox.save();

    // Optionally, update Step and Phase completion statuses
    if (is_completed) {
      // Check if all checkboxes in the step are completed
      const incompleteCheckboxes = await Checkbox.count({
        where: {
          stepId: checkbox.stepId,
          is_completed: false,
        },
      });

      if (incompleteCheckboxes === 0) {
        const step = await Step.findByPk(checkbox.stepId);
        step.is_completed = true;
        await step.save();

        // Check if all steps in the phase are completed
        const incompleteSteps = await Step.count({
          where: {
            phaseId: step.phaseId,
            is_completed: false,
          },
        });

        if (incompleteSteps === 0) {
          const phase = await Phase.findByPk(step.phaseId);
          phase.is_completed = true;
          await phase.save();
        }
      }
    } else {
      // If a checkbox is unchecked, ensure the step and phase are also unchecked
      const step = await Step.findByPk(checkbox.stepId);
      if (step.is_completed) {
        step.is_completed = false;
        await step.save();

        const phase = await Phase.findByPk(step.phaseId);
        if (phase.is_completed) {
          phase.is_completed = false;
          await phase.save();
        }
      }
    }

    res.json(checkbox);
  } catch (error) {
    console.error('Error updating checkbox:', error);
    res.status(500).json({ error: 'Failed to update checkbox.' });
  }
});

// Handle undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

// Handle front-end routes (for Single Page Applications)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'learning-objectives.html')); // Adjust as needed
});

// Serve index.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});