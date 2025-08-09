 

-- Create users table
CREATE TABLE IF NOT EXISTS users (
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
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
    challenge_id SERIAL PRIMARY KEY,
    expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create solutions table
CREATE TABLE IF NOT EXISTS solutions (
    solution_id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create anonymous_questions table
CREATE TABLE IF NOT EXISTS anonymous_questions (
    question_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES anonymous_questions(question_id) ON DELETE CASCADE,
    expert_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
