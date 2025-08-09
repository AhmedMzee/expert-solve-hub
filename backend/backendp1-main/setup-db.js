require('dotenv').config();
const pool = require('./config/database');

async function fixDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Drop and recreate the users table with the correct schema
    console.log('Dropping existing users table...');
    await pool.query('DROP TABLE IF EXISTS answers CASCADE');
    await pool.query('DROP TABLE IF EXISTS solutions CASCADE');  
    await pool.query('DROP TABLE IF EXISTS anonymous_questions CASCADE');
    await pool.query('DROP TABLE IF EXISTS challenges CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('Creating users table with correct schema...');
    await pool.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        bio TEXT,
        user_type VARCHAR(20) DEFAULT 'user' CHECK (user_type IN ('user', 'expert', 'admin', 'student')),
        area_of_expertise VARCHAR(255),
        profile_picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Creating other tables...');
    
    // Create challenges table
    await pool.query(`
      CREATE TABLE challenges (
        challenge_id SERIAL PRIMARY KEY,
        expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create solutions table
    await pool.query(`
      CREATE TABLE solutions (
        solution_id SERIAL PRIMARY KEY,
        challenge_id INTEGER REFERENCES challenges(challenge_id) ON DELETE CASCADE,
        expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create anonymous_questions table
    await pool.query(`
      CREATE TABLE anonymous_questions (
        question_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create answers table
    await pool.query(`
      CREATE TABLE answers (
        answer_id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES anonymous_questions(question_id) ON DELETE CASCADE,
        expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('🎉 Database setup completed successfully!');
    console.log('✅ All tables created with correct schema');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    await pool.end();
  }
}

fixDatabase();
