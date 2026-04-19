const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create a new pool using the single Connection String (DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Required for Neon and most cloud providers to ensure a secure connection
    rejectUnauthorized: false 
  }
});

// Professional error handling for the idle pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

module.exports = pool;