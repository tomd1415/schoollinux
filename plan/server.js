// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'setup_linux',
  host: 'localhost',
  database: 'setup_linux_notes',
  password: 'exhall2024',
  port: 5432,
});

// Middlewares
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from the project root

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

// Serve index.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3500, () => {
  console.log('Server running on http://localhost:3500');
});