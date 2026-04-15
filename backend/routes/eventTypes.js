const express = require('express');
const router = express.Router();
const db = require('../db');
const DEFAULT_USER_ID = 1;

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM event_types WHERE user_id = $1 ORDER BY created_at DESC',
      [DEFAULT_USER_ID]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, slug, description, duration } = req.body;
  if (!title || !slug || !duration) {
    return res.status(400).json({ error: 'title, slug, duration are required' });
  }
  try {
    const result = await db.query(
      `INSERT INTO event_types (user_id, title, slug, description, duration)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [DEFAULT_USER_ID, title, slug.toLowerCase().replace(/\s+/g, '-'), description, duration]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Slug already exists' });
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { title, slug, description, duration, is_active } = req.body;
  try {
    const result = await db.query(
      `UPDATE event_types SET title=$1, slug=$2, description=$3, duration=$4, is_active=$5
       WHERE id=$6 AND user_id=$7 RETURNING *`,
      [title, slug, description, duration, is_active, req.params.id, DEFAULT_USER_ID]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM event_types WHERE id=$1 AND user_id=$2',
      [req.params.id, DEFAULT_USER_ID]
    );
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;