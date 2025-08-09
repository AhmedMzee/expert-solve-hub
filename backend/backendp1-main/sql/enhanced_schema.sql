-- Enhanced Database Schema for ExpertSolve Hub
-- Drop existing tables if you want to recreate (commented out for safety)
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS challenge_participants CASCADE;
-- DROP TABLE IF EXISTS user_follows CASCADE;
-- DROP TABLE IF EXISTS answers CASCADE;
-- DROP TABLE IF EXISTS anonymous_questions CASCADE;
-- DROP TABLE IF EXISTS solutions CASCADE;
-- DROP TABLE IF EXISTS challenges CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table FIRST (referenced by users)
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- For hex colors like #007AFF
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories BEFORE creating users table
INSERT INTO categories (name, description, icon, color) VALUES
('Technology', 'Programming, Software Development, IT', 'laptop', '#007AFF'),
('Business', 'Entrepreneurship, Management, Finance', 'briefcase', '#FF9500'),
('Design', 'UI/UX, Graphic Design, Web Design', 'paintbrush', '#FF3B30'),
('Marketing', 'Digital Marketing, SEO, Social Media', 'megaphone', '#34C759'),
('Education', 'Teaching, Research, Academic', 'book', '#5856D6'),
('Health', 'Medicine, Fitness, Wellness', 'heart', '#FF2D92'),
('Science', 'Research, Data Science, Analytics', 'flask', '#00C7BE'),
('Arts', 'Creative Writing, Music, Photography', 'camera', '#FF9F0A'),
('Engineering', 'Mechanical, Civil, Electrical', 'gear', '#8E8E93'),
('General', 'Miscellaneous topics', 'question', '#6D6D70')
ON CONFLICT (name) DO NOTHING;

-- Enhanced users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    bio TEXT,
    user_type VARCHAR(20) DEFAULT 'user' CHECK (user_type IN ('user', 'expert', 'admin')),
    area_of_expertise_id INTEGER REFERENCES categories(category_id),
    profile_picture VARCHAR(500), -- URL to profile image
    phone VARCHAR(20),
    location VARCHAR(100),
    website VARCHAR(255),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    expertise_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00, -- Average rating 0.00-5.00
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced challenges table
CREATE TABLE IF NOT EXISTS challenges (
    challenge_id SERIAL PRIMARY KEY,
    expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_time INTEGER, -- in minutes
    max_participants INTEGER DEFAULT 0, -- 0 = unlimited
    deadline TIMESTAMP,
    prize VARCHAR(255), -- description of prize/reward
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    views_count INTEGER DEFAULT 0,
    participants_count INTEGER DEFAULT 0,
    solutions_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Challenge participants table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS challenge_participants (
    participant_id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
    UNIQUE(challenge_id, user_id)
);

-- Enhanced solutions table
CREATE TABLE IF NOT EXISTS solutions (
    solution_id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE, -- Changed from expert_id to user_id
    title VARCHAR(255),
    content TEXT NOT NULL,
    attachment_url VARCHAR(500), -- URL to uploaded files
    code_snippet TEXT, -- For coding challenges
    github_link VARCHAR(255),
    demo_link VARCHAR(255),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'reviewed', 'accepted', 'rejected')),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    is_winner BOOLEAN DEFAULT FALSE,
    review_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced anonymous questions table
CREATE TABLE IF NOT EXISTS anonymous_questions (
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
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced answers table
CREATE TABLE IF NOT EXISTS answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES anonymous_questions(question_id) ON DELETE CASCADE,
    expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachment_url VARCHAR(500),
    is_best_answer BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User follows table (experts can have followers)
CREATE TABLE IF NOT EXISTS user_follows (
    follow_id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    following_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id) -- Users can't follow themselves
);

-- User ratings table (for rating experts and solutions)
CREATE TABLE IF NOT EXISTS user_ratings (
    rating_id SERIAL PRIMARY KEY,
    rater_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    rated_user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    rating_type VARCHAR(20) CHECK (rating_type IN ('expert', 'solution', 'answer')),
    reference_id INTEGER, -- ID of the solution/answer being rated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rater_id, rated_user_id, rating_type, reference_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- 'challenge', 'answer', 'follow', 'rating', etc.
    reference_id INTEGER, -- ID of the related entity
    reference_type VARCHAR(50), -- 'challenge', 'question', 'answer', etc.
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table (for better security and session management)
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table (for tracking user actions)
CREATE TABLE IF NOT EXISTS activity_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'challenge', 'question', 'answer', etc.
    entity_id INTEGER,
    details JSONB, -- Store additional data as JSON
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
-- (Already inserted above, so this section is removed to avoid duplicates)

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_challenges_expert_id ON challenges(expert_id);
CREATE INDEX IF NOT EXISTS idx_challenges_category_id ON challenges(category_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_solutions_challenge_id ON solutions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_solutions_user_id ON solutions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON anonymous_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_category_id ON anonymous_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_expert_id ON answers(expert_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solutions_updated_at BEFORE UPDATE ON solutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON anonymous_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
