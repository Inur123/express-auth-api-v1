require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function setupDatabase() {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS users;
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Tabel users siap digunakan');
  } catch (err) {
    console.error('❌ Gagal membuat tabel users:', err.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();
