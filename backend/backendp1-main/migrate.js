const pool = require('./config/database');

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Check if password column exists and rename it to password_hash
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('Renaming password column to password_hash...');
      await pool.query('ALTER TABLE users RENAME COLUMN password TO password_hash');
      console.log('✅ Renamed password to password_hash');
    } else {
      console.log('password_hash column already exists or table not found');
    }
    
    // Check if updated_at column exists and add it if not
    const checkUpdatedAt = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'updated_at'
    `);
    
    if (checkUpdatedAt.rows.length === 0) {
      console.log('Adding updated_at column...');
      await pool.query('ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log('✅ Added updated_at column');
    } else {
      console.log('updated_at column already exists');
    }
    
    // Update user_type constraint to include new roles
    console.log('Updating user_type constraint...');
    await pool.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check;
      ALTER TABLE users ADD CONSTRAINT users_user_type_check 
      CHECK (user_type IN ('user', 'expert', 'admin', 'student'));
    `);
    console.log('✅ Updated user_type constraint');
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await pool.end();
  }
}

migrate();
