const pool = require('../config/database');

class Challenge {
  static async create(challengeData) {
    const { creatorId, title, description, categoryId, difficulty, estimatedTime } = challengeData;
    
    const query = `
      INSERT INTO challenges (creator_id, title, description, category_id, difficulty_level, estimated_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [creatorId, title, description, categoryId, difficulty, estimatedTime];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = `
      SELECT c.*, u.full_name as creator_name, u.username as creator_username, 
             cat.name as category_name, cat.color as category_color,
             COUNT(cp.user_id) as participant_count,
             COUNT(s.solution_id) as solution_count
      FROM challenges c
      JOIN users u ON c.creator_id = u.user_id
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN challenge_participants cp ON c.challenge_id = cp.challenge_id
      LEFT JOIN solutions s ON c.challenge_id = s.challenge_id
      GROUP BY c.challenge_id, u.user_id, cat.category_id
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(challengeId) {
    const query = `
      SELECT c.*, u.full_name as creator_name, u.username as creator_username,
             cat.name as category_name, cat.color as category_color,
             COUNT(DISTINCT cp.user_id) as participant_count,
             COUNT(DISTINCT s.solution_id) as solution_count
      FROM challenges c
      JOIN users u ON c.creator_id = u.user_id
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN challenge_participants cp ON c.challenge_id = cp.challenge_id
      LEFT JOIN solutions s ON c.challenge_id = s.challenge_id
      WHERE c.challenge_id = $1
      GROUP BY c.challenge_id, u.user_id, cat.category_id
    `;
    const result = await pool.query(query, [challengeId]);
    return result.rows[0];
  }

  static async getByCreator(creatorId) {
    const query = `
      SELECT c.*, cat.name as category_name, cat.color as category_color,
             COUNT(DISTINCT cp.user_id) as participant_count,
             COUNT(DISTINCT s.solution_id) as solution_count
      FROM challenges c
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN challenge_participants cp ON c.challenge_id = cp.challenge_id
      LEFT JOIN solutions s ON c.challenge_id = s.challenge_id
      WHERE c.creator_id = $1
      GROUP BY c.challenge_id, cat.category_id
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [creatorId]);
    return result.rows;
  }

  static async joinChallenge(challengeId, userId) {
    const query = `
      INSERT INTO challenge_participants (challenge_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (challenge_id, user_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [challengeId, userId]);
    return result.rows[0];
  }

  static async leaveChallenge(challengeId, userId) {
    const query = 'DELETE FROM challenge_participants WHERE challenge_id = $1 AND user_id = $2';
    const result = await pool.query(query, [challengeId, userId]);
    return result.rowCount > 0;
  }

  static async getParticipants(challengeId) {
    const query = `
      SELECT u.user_id, u.full_name, u.username, u.profile_picture, cp.joined_at
      FROM users u
      JOIN challenge_participants cp ON u.user_id = cp.user_id
      WHERE cp.challenge_id = $1
      ORDER BY cp.joined_at ASC
    `;
    const result = await pool.query(query, [challengeId]);
    return result.rows;
  }

  static async getSolutions(challengeId) {
    const query = `
      SELECT s.*, u.full_name as creator_name, u.username as creator_username,
             AVG(sr.rating) as average_rating, COUNT(sr.rating_id) as rating_count
      FROM solutions s
      JOIN users u ON s.creator_id = u.user_id
      LEFT JOIN solution_ratings sr ON s.solution_id = sr.solution_id
      WHERE s.challenge_id = $1
      GROUP BY s.solution_id, u.user_id
      ORDER BY s.created_at DESC
    `;
    const result = await pool.query(query, [challengeId]);
    return result.rows;
  }

  // Update challenge
  static async update(challengeId, updateData) {
    const { title, description, categoryId, difficulty, estimatedTime } = updateData;
    
    const query = `
      UPDATE challenges 
      SET title = $1, description = $2, category_id = $3, difficulty_level = $4, 
          estimated_time = $5, updated_at = CURRENT_TIMESTAMP
      WHERE challenge_id = $6
      RETURNING *
    `;
    
    const values = [title, description, categoryId, difficulty, estimatedTime, challengeId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete challenge
  static async delete(challengeId) {
    const query = 'DELETE FROM challenges WHERE challenge_id = $1 RETURNING *';
    const result = await pool.query(query, [challengeId]);
    return result.rows[0];
  }

  // Get challenges by category
  static async getByCategory(categoryId) {
    const query = `
      SELECT c.*, u.full_name as creator_name, u.username as creator_username,
             cat.name as category_name, cat.color as category_color,
             COUNT(DISTINCT cp.user_id) as participant_count,
             COUNT(DISTINCT s.solution_id) as solution_count
      FROM challenges c
      JOIN users u ON c.creator_id = u.user_id
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN challenge_participants cp ON c.challenge_id = cp.challenge_id
      LEFT JOIN solutions s ON c.challenge_id = s.challenge_id
      WHERE c.category_id = $1
      GROUP BY c.challenge_id, u.user_id, cat.category_id
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [categoryId]);
    return result.rows;
  }
}

module.exports = Challenge;
