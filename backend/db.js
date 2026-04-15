const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:2612@localhost:5432/calclone',
  ssl: false
});

module.exports = pool;