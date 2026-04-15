const express = require('express');
const router = express.Router();
const db = require('../db');
const DEFAULT_USER_ID = 1;

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM availability WHERE user_id=$1 ORDER BY day_of_week',
      [DEFAULT_USER_ID]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  // Expects: [{ day_of_week, start_time, end_time, is_available }]
  const slots = req.body;
  try {
    await db.query('DELETE FROM availability WHERE user_id=$1', [DEFAULT_USER_ID]);
    for (const slot of slots) {
      await db.query(
        `INSERT INTO availability (user_id, day_of_week, start_time, end_time, is_available)
         VALUES ($1,$2,$3,$4,$5)`,
        [DEFAULT_USER_ID, slot.day_of_week, slot.start_time, slot.end_time, slot.is_available]
      );
    }
    res.json({ message: 'Availability updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;