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

// ===== Checkbox API Endpoints ===== //

// Get a single checkbox by ID
/*
app.get('/api/checkboxes/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const checkbox = await Checkbox.findByPk(id);
      if (checkbox) {
          res.status(200).json(checkbox);
      } else {
          res.status(404).json({ error: 'Checkbox not found' });
      }
  } catch (error) {
      console.error('Error fetching checkbox:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
*/
// Get all checkboxes
app.get('/api/checkboxes', async (req, res) => {
  try {
      const checkboxes = await Checkbox.findAll();
      res.status(200).json(checkboxes);
  } catch (error) {
      console.error('Error fetching all checkboxes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
/*
// Update a checkbox's completion status
app.put('/api/checkboxes/:id', async (req, res) => {
  const { id } = req.params;
  const { is_completed } = req.body;

  try {
      const checkbox = await Checkbox.findByPk(id);
      if (!checkbox) {
          return res.status(404).json({ error: 'Checkbox not found' });
      }

      checkbox.is_completed = is_completed;
      await checkbox.save();

      res.status(200).json(checkbox);
  } catch (error) {
      console.error('Error updating checkbox:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
*/

// Get a single checkbox by stepId
app.get('/api/checkboxes/:stepId', async (req, res) => {
    const { stepId } = req.params;
    try {
        // Find or create the Step
        let step = await Step.findOne({ where: { stepId } });
        if (!step) {
            step = await Step.create({
                stepId,
                name: stepId, // Adjust the name as necessary
                phaseId: 1,    // Set the appropriate phaseId
                is_completed: false,
            });
            console.log(`Step with stepId ${stepId} created.`);
        }

        // Find or create the Checkbox
        let checkbox = await Checkbox.findOne({ where: { stepId } });
        if (!checkbox) {
            checkbox = await Checkbox.create({
                stepId,
                is_completed: false,
            });
            console.log(`Checkbox with stepId ${stepId} created.`);
        }

        res.status(200).json(checkbox);
    } catch (error) {
        console.error('Error fetching or creating checkbox:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a checkbox's completion status by stepId
app.put('/api/checkboxes/:stepId', async (req, res) => {
    const { stepId } = req.params;
    const { is_completed } = req.body;

    try {
        // Find or create the Step
        let step = await Step.findOne({ where: { stepId } });
        if (!step) {
            step = await Step.create({
                stepId,
                name: stepId, // Adjust the name as necessary
                phaseId: 1,    // Set the appropriate phaseId
                is_completed: is_completed || false,
            });
            console.log(`Step with stepId ${stepId} created.`);
        }

        // Find or create the Checkbox
        let checkbox = await Checkbox.findOne({ where: { stepId } });
        if (!checkbox) {
            checkbox = await Checkbox.create({
                stepId,
                is_completed,
            });
            console.log(`Checkbox with stepId ${stepId} created and set to ${is_completed}.`);
        } else {
            // Update existing checkbox
            checkbox.is_completed = is_completed;
            await checkbox.save();
            console.log(`Checkbox with stepId ${stepId} updated to ${is_completed}.`);
        }

        res.status(200).json(checkbox);
    } catch (error) {
        console.error('Error updating checkbox:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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