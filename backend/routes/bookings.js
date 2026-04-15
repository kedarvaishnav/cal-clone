const { sendBookingConfirmation } = require('../mailer');
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.*, et.title as event_title, et.duration
       FROM bookings b
       JOIN event_types et ON b.event_type_id = et.id
       ORDER BY b.start_time DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  console.log("🔥 POST /bookings hit");   

  const { event_type_id, booker_name, booker_email, start_time, notes } = req.body;
  try {
    // Check double booking
    const et = await db.query('SELECT duration FROM event_types WHERE id=$1', [event_type_id]);
    if (et.rows.length === 0) return res.status(404).json({ error: 'Event type not found' });
    const duration = et.rows[0].duration;

    const start = new Date(start_time);
    const end = new Date(start.getTime() + duration * 60000);

    const conflict = await db.query(
      `SELECT id FROM bookings WHERE event_type_id=$1
       AND status='confirmed'
       AND start_time < $2 AND end_time > $3`,
      [event_type_id, end.toISOString(), start.toISOString()]
    );
    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: 'This slot is already booked' });
    }

    const result = await db.query(
      `INSERT INTO bookings (event_type_id, booker_name, booker_email, start_time, end_time, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [event_type_id, booker_name, booker_email, start.toISOString(), end.toISOString(), notes || null]
    );
    // Send confirmation emails
    try {
      const etDetails = await db.query(
        'SELECT et.title, u.email as host_email FROM event_types et JOIN users u ON et.user_id = u.id WHERE et.id = $1',
        [event_type_id]
      );
      if (etDetails.rows.length > 0) {
        await sendBookingConfirmation({
          bookerName: booker_name,
          bookerEmail: booker_email,
          eventTitle: etDetails.rows[0].title,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          hostEmail: etDetails.rows[0].host_email
        });
      }
    } catch (mailErr) {
      console.error('Email failed (booking still saved):', mailErr.message);
    }

    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/cancel', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;