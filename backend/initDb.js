const fs = require('fs/promises');
const path = require('path');
const db = require('./db');

const DEFAULT_USER = {
  id: 1,
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  timezone: 'Asia/Kolkata'
};

const DEFAULT_AVAILABILITY = [
  [1, '09:00', '17:00', true],
  [2, '09:00', '17:00', true],
  [3, '09:00', '17:00', true],
  [4, '09:00', '17:00', true],
  [5, '09:00', '17:00', true]
];

async function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = await fs.readFile(schemaPath, 'utf8');

  await db.query(schemaSql);

  await db.query(
    `INSERT INTO users (id, name, username, email, timezone)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO NOTHING`,
    [
      DEFAULT_USER.id,
      DEFAULT_USER.name,
      DEFAULT_USER.username,
      DEFAULT_USER.email,
      DEFAULT_USER.timezone
    ]
  );

  const availabilityCheck = await db.query(
    'SELECT COUNT(*)::int AS count FROM availability WHERE user_id = $1',
    [DEFAULT_USER.id]
  );

  if (availabilityCheck.rows[0].count === 0) {
    for (const [dayOfWeek, startTime, endTime, isAvailable] of DEFAULT_AVAILABILITY) {
      await db.query(
        `INSERT INTO availability (user_id, day_of_week, start_time, end_time, is_available)
         VALUES ($1, $2, $3, $4, $5)`,
        [DEFAULT_USER.id, dayOfWeek, startTime, endTime, isAvailable]
      );
    }
  }
}

module.exports = initDb;
