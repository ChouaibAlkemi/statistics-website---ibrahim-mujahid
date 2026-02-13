// Create tables if they don't exist
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  age INTEGER,
  answers INTEGER[] NOT NULL,
  total_score INTEGER NOT NULL,
  aggression_level VARCHAR(50) NOT NULL,
  dimension_scores JSONB,
  interpretation_text TEXT,
  recommendations TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  anonymous_name VARCHAR(255) NOT NULL,
  total_score INTEGER NOT NULL,
  aggression_level VARCHAR(50) NOT NULL,
  feedback_text TEXT NOT NULL,
  answers INTEGER[], -- Stores the user's choices
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const setupDatabase = async (pool) => {
  try {
    await pool.query(schema);
    console.log('Database schema synchronized successfully.');
  } catch (err) {
    console.error('Error synchronizing database schema:', err);
  }
};

module.exports = setupDatabase;
