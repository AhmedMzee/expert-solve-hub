const pool = require('../config/database');

class Solution {
  static async create(solutionData) {
    const { challengeId, creatorId, title, description, codeContent, language, githubUrl } = solutionData;
    
    const query = `
      INSERT INTO solutions (challenge_id, creator_id, title, description, code_content, programming_language, github_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [challengeId, creatorId, title, description, codeContent, language, githubUrl];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getById(solutionId) {
    const query = `
      SELECT s.*, u.full_name as creator_name, u.username as creator_username,
             c.title as challenge_title,
             AVG(sr.rating) as average_rating, COUNT(sr.rating_id) as rating_count
      FROM solutions s
      JOIN users u ON s.creator_id = u.user_id
      JOIN challenges c ON s.challenge_id = c.challenge_id
      LEFT JOIN solution_ratings sr ON s.solution_id = sr.solution_id
      WHERE s.solution_id = $1
      GROUP BY s.solution_id, u.user_id, c.challenge_id
    `;
    const result = await pool.query(query, [solutionId]);
    return result.rows[0];
  }

  static async getByChallenge(challengeId) {
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

  static async getByCreator(creatorId) {
    const query = `
      SELECT s.*, c.title as challenge_title, c.challenge_id,
             AVG(sr.rating) as average_rating, COUNT(sr.rating_id) as rating_count
      FROM solutions s
      JOIN challenges c ON s.challenge_id = c.challenge_id
      LEFT JOIN solution_ratings sr ON s.solution_id = sr.solution_id
      WHERE s.creator_id = $1
      GROUP BY s.solution_id, c.challenge_id
      ORDER BY s.created_at DESC
    `;
    const result = await pool.query(query, [creatorId]);
    return result.rows;
  }

  static async update(solutionId, updateData) {
    const { title, description, codeContent, language, githubUrl } = updateData;
    
    const query = `
      UPDATE solutions 
      SET title = $1, description = $2, code_content = $3, programming_language = $4, 
          github_url = $5, updated_at = CURRENT_TIMESTAMP
      WHERE solution_id = $6
      RETURNING *
    `;
    
    const values = [title, description, codeContent, language, githubUrl, solutionId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(solutionId) {
    const query = 'DELETE FROM solutions WHERE solution_id = $1 RETURNING *';
    const result = await pool.query(query, [solutionId]);
    return result.rows[0];
  }

  // Rate a solution
  static async rateSolution(solutionId, userId, rating, comment = null) {
    const query = `
      INSERT INTO solution_ratings (solution_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (solution_id, user_id) 
      DO UPDATE SET rating = $3, comment = $4, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [solutionId, userId, rating, comment];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get ratings for a solution
  static async getRatings(solutionId) {
    const query = `
      SELECT sr.*, u.full_name as user_name, u.username
      FROM solution_ratings sr
      JOIN users u ON sr.user_id = u.user_id
      WHERE sr.solution_id = $1
      ORDER BY sr.created_at DESC
    `;
    const result = await pool.query(query, [solutionId]);
    return result.rows;
  }

  // Get solution statistics
  static async getStatistics(solutionId) {
    const query = `
      SELECT 
        COUNT(*) as total_ratings,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_ratings,
        COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_ratings
      FROM solution_ratings
      WHERE solution_id = $1
    `;
    const result = await pool.query(query, [solutionId]);
    return result.rows[0];
  }

  // Check if user has rated this solution
  static async hasUserRated(solutionId, userId) {
    const query = 'SELECT rating_id FROM solution_ratings WHERE solution_id = $1 AND user_id = $2';
    const result = await pool.query(query, [solutionId, userId]);
    return result.rows.length > 0;
  }

  // Get top rated solutions
  static async getTopRated(limit = 10) {
    const query = `
      SELECT s.*, u.full_name as creator_name, u.username as creator_username,
             c.title as challenge_title, c.challenge_id,
             AVG(sr.rating) as average_rating, COUNT(sr.rating_id) as rating_count
      FROM solutions s
      JOIN users u ON s.creator_id = u.user_id
      JOIN challenges c ON s.challenge_id = c.challenge_id
      LEFT JOIN solution_ratings sr ON s.solution_id = sr.solution_id
      GROUP BY s.solution_id, u.user_id, c.challenge_id
      HAVING COUNT(sr.rating_id) >= 3
      ORDER BY AVG(sr.rating) DESC, COUNT(sr.rating_id) DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  // Get solutions by programming language
  static async getByLanguage(language) {
    const query = `
      SELECT s.*, u.full_name as creator_name, u.username as creator_username,
             c.title as challenge_title,
             AVG(sr.rating) as average_rating, COUNT(sr.rating_id) as rating_count
      FROM solutions s
      JOIN users u ON s.creator_id = u.user_id
      JOIN challenges c ON s.challenge_id = c.challenge_id
      LEFT JOIN solution_ratings sr ON s.solution_id = sr.solution_id
      WHERE s.programming_language = $1
      GROUP BY s.solution_id, u.user_id, c.challenge_id
      ORDER BY s.created_at DESC
    `;
    const result = await pool.query(query, [language]);
    return result.rows;
  }
}

module.exports = Solution;
