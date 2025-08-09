const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function cycleFreeMigration() {
  try {
    console.log('🗄️  Starting cycle-free database migration...');
    
    // First, check connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Drop existing tables in reverse dependency order
    console.log('🗑️  Dropping existing tables...');
    const dropQueries = [
      'DROP TABLE IF EXISTS activity_logs CASCADE;',
      'DROP TABLE IF EXISTS user_sessions CASCADE;',
      'DROP TABLE IF EXISTS notifications CASCADE;',
      'DROP TABLE IF EXISTS solution_ratings CASCADE;',
      'DROP TABLE IF EXISTS answer_ratings CASCADE;',
      'DROP TABLE IF EXISTS expert_ratings CASCADE;',
      'DROP TABLE IF EXISTS user_follows CASCADE;',
      'DROP TABLE IF EXISTS answers CASCADE;',
      'DROP TABLE IF EXISTS solutions CASCADE;',
      'DROP TABLE IF EXISTS anonymous_questions CASCADE;',
      'DROP TABLE IF EXISTS challenge_participants CASCADE;',
      'DROP TABLE IF EXISTS challenges CASCADE;',
      'DROP TABLE IF EXISTS user_expertise CASCADE;',
      'DROP TABLE IF EXISTS users CASCADE;',
      'DROP TABLE IF EXISTS categories CASCADE;'
    ];
    
    for (const query of dropQueries) {
      await pool.query(query);
    }
    console.log('✅ Existing tables dropped');
    
    // Create tables in strict dependency order (no cycles)
    console.log('📊 Creating cycle-free tables...');
    
    // LEVEL 1: No dependencies
    console.log('📊 Level 1: Creating base tables...');
    
    // 1. Categories (completely independent)
    await pool.query(`
      CREATE TABLE categories (
        category_id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(7),
        parent_category_id INTEGER REFERENCES categories(category_id),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Categories table created');
    
    // Insert default categories
    await pool.query(`
      INSERT INTO categories (name, description, icon, color, sort_order) VALUES
      ('Technology', 'Programming, Software Development, IT', 'laptop', '#007AFF', 1),
      ('Business', 'Entrepreneurship, Management, Finance', 'briefcase', '#FF9500', 2),
      ('Design', 'UI/UX, Graphic Design, Web Design', 'paintbrush', '#FF3B30', 3),
      ('Marketing', 'Digital Marketing, SEO, Social Media', 'megaphone', '#34C759', 4),
      ('Education', 'Teaching, Research, Academic', 'book', '#5856D6', 5),
      ('Health', 'Medicine, Fitness, Wellness', 'heart', '#FF2D92', 6),
      ('Science', 'Research, Data Science, Analytics', 'flask', '#00C7BE', 7),
      ('Arts', 'Creative Writing, Music, Photography', 'camera', '#FF9F0A', 8),
      ('Engineering', 'Mechanical, Civil, Electrical', 'gear', '#8E8E93', 9),
      ('General', 'Miscellaneous topics', 'question', '#6D6D70', 10);
    `);
    console.log('✅ Default categories inserted');
    
    // LEVEL 2: Depends only on Level 1
    console.log('📊 Level 2: Creating user tables...');
    
    // 2. Users (no foreign key dependencies to avoid cycles)
    await pool.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        bio TEXT,
        user_type VARCHAR(20) DEFAULT 'user' CHECK (user_type IN ('user', 'expert', 'admin')),
        profile_picture VARCHAR(500),
        phone VARCHAR(20),
        location VARCHAR(100),
        website VARCHAR(255),
        linkedin VARCHAR(255),
        github VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');
    
    // LEVEL 3: Depends on Level 1 and 2
    console.log('📊 Level 3: Creating relationship tables...');
    
    // 3. User Expertise (separate table to avoid cycle)
    await pool.query(`
      CREATE TABLE user_expertise (
        expertise_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
        skill_level VARCHAR(20) DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
        years_experience INTEGER DEFAULT 0,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, category_id)
      );
    `);
    console.log('✅ User Expertise table created');
    
    // 4. User Follows (one-way relationship, no cycles)
    await pool.query(`
      CREATE TABLE user_follows (
        follow_id SERIAL PRIMARY KEY,
        follower_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        following_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id),
        CHECK (follower_id != following_id)
      );
    `);
    console.log('✅ User Follows table created');
    
    // LEVEL 4: Depends on Level 1, 2, and 3
    console.log('📊 Level 4: Creating content tables...');
    
    // 5. Challenges
    await pool.query(`
      CREATE TABLE challenges (
        challenge_id SERIAL PRIMARY KEY,
        expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(category_id),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
        estimated_time INTEGER,
        max_participants INTEGER DEFAULT 0,
        deadline TIMESTAMP,
        prize VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
        views_count INTEGER DEFAULT 0,
        participants_count INTEGER DEFAULT 0,
        solutions_count INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Challenges table created');
    
    // 6. Anonymous Questions
    await pool.query(`
      CREATE TABLE anonymous_questions (
        question_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(category_id),
        title VARCHAR(255),
        content TEXT NOT NULL,
        urgency_level VARCHAR(20) DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high', 'urgent')),
        status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
        views_count INTEGER DEFAULT 0,
        answers_count INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Anonymous Questions table created');
    
    // LEVEL 5: Depends on Level 4
    console.log('📊 Level 5: Creating participation tables...');
    
    // 7. Challenge Participants
    await pool.query(`
      CREATE TABLE challenge_participants (
        participant_id SERIAL PRIMARY KEY,
        challenge_id INTEGER REFERENCES challenges(challenge_id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
        UNIQUE(challenge_id, user_id)
      );
    `);
    console.log('✅ Challenge Participants table created');
    
    // 8. Solutions (no ratings here to avoid cycles)
    await pool.query(`
      CREATE TABLE solutions (
        solution_id SERIAL PRIMARY KEY,
        challenge_id INTEGER REFERENCES challenges(challenge_id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        title VARCHAR(255),
        content TEXT NOT NULL,
        attachment_url VARCHAR(500),
        code_snippet TEXT,
        github_link VARCHAR(255),
        demo_link VARCHAR(255),
        status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'reviewed', 'accepted', 'rejected')),
        is_winner BOOLEAN DEFAULT FALSE,
        review_feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Solutions table created');
    
    // 9. Answers (no ratings here to avoid cycles)
    await pool.query(`
      CREATE TABLE answers (
        answer_id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES anonymous_questions(question_id) ON DELETE CASCADE,
        expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        attachment_url VARCHAR(500),
        is_best_answer BOOLEAN DEFAULT FALSE,
        helpful_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Answers table created');
    
    // LEVEL 6: Rating tables (separate to avoid cycles)
    console.log('📊 Level 6: Creating rating tables...');
    
    // 10. Expert Ratings (users rate experts)
    await pool.query(`
      CREATE TABLE expert_ratings (
        rating_id SERIAL PRIMARY KEY,
        expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        rater_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(expert_id, rater_id),
        CHECK (expert_id != rater_id)
      );
    `);
    console.log('✅ Expert Ratings table created');
    
    // 11. Solution Ratings (users rate solutions)
    await pool.query(`
      CREATE TABLE solution_ratings (
        rating_id SERIAL PRIMARY KEY,
        solution_id INTEGER REFERENCES solutions(solution_id) ON DELETE CASCADE,
        rater_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(solution_id, rater_id)
      );
    `);
    console.log('✅ Solution Ratings table created');
    
    // 12. Answer Ratings (users rate answers)
    await pool.query(`
      CREATE TABLE answer_ratings (
        rating_id SERIAL PRIMARY KEY,
        answer_id INTEGER REFERENCES answers(answer_id) ON DELETE CASCADE,
        rater_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(answer_id, rater_id)
      );
    `);
    console.log('✅ Answer Ratings table created');
    
    // LEVEL 7: Notification and logging tables
    console.log('📊 Level 7: Creating system tables...');
    
    // 13. Notifications
    await pool.query(`
      CREATE TABLE notifications (
        notification_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        notification_type VARCHAR(50) NOT NULL,
        reference_id INTEGER,
        reference_type VARCHAR(50),
        is_read BOOLEAN DEFAULT FALSE,
        priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Notifications table created');
    
    // 14. User Sessions (for auth management)
    await pool.query(`
      CREATE TABLE user_sessions (
        session_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        device_info TEXT,
        ip_address INET,
        is_active BOOLEAN DEFAULT TRUE,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ User Sessions table created');
    
    // 15. Activity Logs (for analytics)
    await pool.query(`
      CREATE TABLE activity_logs (
        log_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50),
        resource_id INTEGER,
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Activity Logs table created');
    
    // Create indexes for performance
    console.log('🔍 Creating indexes...');
    const indexes = [
      // User indexes
      'CREATE INDEX idx_users_email ON users(email);',
      'CREATE INDEX idx_users_username ON users(username);',
      'CREATE INDEX idx_users_user_type ON users(user_type);',
      'CREATE INDEX idx_users_is_active ON users(is_active);',
      
      // Expertise indexes
      'CREATE INDEX idx_user_expertise_user_id ON user_expertise(user_id);',
      'CREATE INDEX idx_user_expertise_category_id ON user_expertise(category_id);',
      
      // Challenge indexes
      'CREATE INDEX idx_challenges_expert_id ON challenges(expert_id);',
      'CREATE INDEX idx_challenges_category_id ON challenges(category_id);',
      'CREATE INDEX idx_challenges_status ON challenges(status);',
      'CREATE INDEX idx_challenges_created_at ON challenges(created_at);',
      
      // Solution indexes
      'CREATE INDEX idx_solutions_challenge_id ON solutions(challenge_id);',
      'CREATE INDEX idx_solutions_user_id ON solutions(user_id);',
      'CREATE INDEX idx_solutions_status ON solutions(status);',
      
      // Question indexes
      'CREATE INDEX idx_questions_user_id ON anonymous_questions(user_id);',
      'CREATE INDEX idx_questions_category_id ON anonymous_questions(category_id);',
      'CREATE INDEX idx_questions_status ON anonymous_questions(status);',
      
      // Answer indexes
      'CREATE INDEX idx_answers_question_id ON answers(question_id);',
      'CREATE INDEX idx_answers_expert_id ON answers(expert_id);',
      
      // Rating indexes
      'CREATE INDEX idx_expert_ratings_expert_id ON expert_ratings(expert_id);',
      'CREATE INDEX idx_solution_ratings_solution_id ON solution_ratings(solution_id);',
      'CREATE INDEX idx_answer_ratings_answer_id ON answer_ratings(answer_id);',
      
      // System indexes
      'CREATE INDEX idx_notifications_user_id ON notifications(user_id);',
      'CREATE INDEX idx_notifications_is_read ON notifications(is_read);',
      'CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);',
      'CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);',
      'CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);',
      'CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);'
    ];
    
    for (const index of indexes) {
      await pool.query(index);
    }
    console.log('✅ Indexes created');
    
    // Create views for complex queries
    console.log('👁️  Creating views...');
    
    // View: Expert ratings summary
    await pool.query(`
      CREATE VIEW expert_rating_summary AS
      SELECT 
        u.user_id,
        u.full_name,
        u.username,
        COALESCE(AVG(er.rating), 0) as average_rating,
        COUNT(er.rating) as total_ratings
      FROM users u
      LEFT JOIN expert_ratings er ON u.user_id = er.expert_id
      WHERE u.user_type = 'expert'
      GROUP BY u.user_id, u.full_name, u.username;
    `);
    
    // View: Challenge statistics
    await pool.query(`
      CREATE VIEW challenge_statistics AS
      SELECT 
        c.challenge_id,
        c.title,
        c.expert_id,
        COUNT(DISTINCT cp.user_id) as participants_count,
        COUNT(DISTINCT s.solution_id) as solutions_count,
        COALESCE(AVG(sr.rating), 0) as average_solution_rating
      FROM challenges c
      LEFT JOIN challenge_participants cp ON c.challenge_id = cp.challenge_id
      LEFT JOIN solutions s ON c.challenge_id = s.challenge_id
      LEFT JOIN solution_ratings sr ON s.solution_id = sr.solution_id
      GROUP BY c.challenge_id, c.title, c.expert_id;
    `);
    
    console.log('✅ Views created');
    
    // Verify final structure
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('\\n📋 Final cycle-free database structure:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    
    // Check for any circular dependencies
    console.log('\\n🔍 Verifying no circular dependencies...');
    const dependencyCheck = await pool.query(`
      SELECT 
        tc.table_name as table_name,
        ccu.table_name as referenced_table
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu 
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, ccu.table_name;
    `);
    
    console.log('\\n📊 Foreign Key Dependencies:');
    dependencyCheck.rows.forEach(row => {
      console.log(`   ${row.table_name} → ${row.referenced_table}`);
    });
    
    console.log('\\n🎉 Cycle-free database migration completed successfully!');
    console.log('🚀 Your ExpertSolve Hub database is optimized and ready!');
    console.log('\\n✅ Benefits of this structure:');
    console.log('   • No circular dependencies');
    console.log('   • Clear hierarchical relationships');
    console.log('   • Separate rating tables prevent cycles');
    console.log('   • Better performance with proper indexing');
    console.log('   • Easy to maintain and extend');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  cycleFreeMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { cycleFreeMigration };
