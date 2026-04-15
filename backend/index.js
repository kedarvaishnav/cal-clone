const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventTypesRouter = require('./routes/eventTypes');
const availabilityRouter = require('./routes/availability');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/event-types', eventTypesRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/bookings', bookingsRouter);

// Public user info
const db = require('./db');
app.get('/api/user', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = 1');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get available slots for a given event type slug + date
app.get('/api/slots/:username/:slug', async (req, res) => {
  const { username, slug } = req.params;
  const { date } = req.query; // YYYY-MM-DD

  try {
    // Get event type
    const etResult = await db.query(
      `SELECT et.* FROM event_types et
       JOIN users u ON et.user_id = u.id
       WHERE u.username = $1 AND et.slug = $2 AND et.is_active = true`,
      [username, slug]
    );
    if (etResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const eventType = etResult.rows[0];

    // Get day of week (0=Sun, 6=Sat)
    const dayOfWeek = new Date(date + 'T00:00:00').getDay();

    // Get availability for that day
    const avResult = await db.query(
      `SELECT * FROM availability WHERE user_id = $1 AND day_of_week = $2 AND is_available = true`,
      [eventType.user_id, dayOfWeek]
    );
    if (avResult.rows.length === 0) return res.json({ slots: [] });
    const av = avResult.rows[0];

    // Check override
    const overrideResult = await db.query(
      `SELECT * FROM availability_overrides WHERE user_id = $1 AND date = $2`,
      [eventType.user_id, date]
    );
    if (overrideResult.rows.length > 0 && overrideResult.rows[0].is_blocked) {
      return res.json({ slots: [] });
    }

    // Generate slots
    const [startH, startM] = av.start_time.split(':').map(Number);
    const [endH, endM] = av.end_time.split(':').map(Number);
    const duration = eventType.duration;
    const slots = [];

    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (current + duration <= end) {
      const h = Math.floor(current / 60).toString().padStart(2, '0');
      const m = (current % 60).toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
      current += duration;
    }

    // Filter out already booked slots
    const bookedResult = await db.query(
      `SELECT start_time, end_time FROM bookings
       WHERE event_type_id = $1
       AND DATE(start_time) = $2
       AND status = 'confirmed'`,
      [eventType.id, date]
    );

    const bookedSlots = bookedResult.rows.map(b => {
      const d = new Date(b.start_time);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    });

    const available = slots.filter(s => !bookedSlots.includes(s));
    res.json({ slots: available, eventType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));