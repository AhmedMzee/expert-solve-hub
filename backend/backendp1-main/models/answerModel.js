const pool = require('../config/database');

class Answer {
  static async create(answerData) {
    const { questionId, expertId, content } = answerData;
    
    const query = `
      INSERT INTO answers (question_id, expert_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [questionId, expertId, content];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getById(answerId) {
    const query = `
      SELECT a.*, u.full_name as expert_name, u.username as expert_username,
             q.title as question_title,
             AVG(ar.rating) as average_rating, COUNT(ar.rating_id) as rating_count
      FROM answers a
      JOIN users u ON a.expert_id = u.user_id
      JOIN anonymous_questions q ON a.question_id = q.question_id
      LEFT JOIN answer_ratings ar ON a.answer_id = ar.answer_id
      WHERE a.answer_id = $1
      GROUP BY a.answer_id, u.user_id, q.question_id
    `;
    const result = await pool.query(query, [answerId]);
    return result.rows[0];
  }

  static async getByQuestion(questionId) {
    const query = `
      SELECT a.*, u.full_name as expert_name, u.username as expert_username,
             AVG(ar.rating) as average_rating, COUNT(ar.rating_id) as rating_count
      FROM answers a
      JOIN users u ON a.expert_id = u.user_id
      LEFT JOIN answer_ratings ar ON a.answer_id = ar.answer_id
      WHERE a.question_id = $1
      GROUP BY a.answer_id, u.user_id
      ORDER BY a.created_at ASC
    `;
    const result = await pool.query(query, [questionId]);
    return result.rows;
  }

  static async getByExpert(expertId) {
    const query = `
      SELECT a.*, q.title as question_title, q.question_id,
             AVG(ar.rating) as average_rating, COUNT(ar.rating_id) as rating_count
      FROM answers a
      JOIN anonymous_questions q ON a.question_id = q.question_id
      LEFT JOIN answer_ratings ar ON a.answer_id = ar.answer_id
      WHERE a.expert_id = $1
      GROUP BY a.answer_id, q.question_id
      ORDER BY a.created_at DESC
    `;
    const result = await pool.query(query, [expertId]);
    return result.rows;
  }

  static async update(answerId, updateData) {
    const { content } = updateData;
    
    const query = `
      UPDATE answers 
      SET content = $1, updated_at = CURRENT_TIMESTAMP
      WHERE answer_id = $2
      RETURNING *
    `;
    
    const values = [content, answerId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(answerId) {
    const query = 'DELETE FROM answers WHERE answer_id = $1 RETURNING *';
    const result = await pool.query(query, [answerId]);
    return result.rows[0];
  }

  // Rate an answer
  static async rateAnswer(answerId, userId, rating, comment = null) {
    const query = `
      INSERT INTO answer_ratings (answer_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (answer_id, user_id) 
      DO UPDATE SET rating = $3, comment = $4, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [answerId, userId, rating, comment];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get ratings for an answer
  static async getRatings(answerId) {
    const query = `
      SELECT ar.*, u.full_name as user_name, u.username
      FROM answer_ratings ar
      JOIN users u ON ar.user_id = u.user_id
      WHERE ar.answer_id = $1
      ORDER BY ar.created_at DESC
    `;
    const result = await pool.query(query, [answerId]);
    return result.rows;
  }

  // Get answer statistics
  static async getStatistics(answerId) {
    const query = `
      SELECT 
        COUNT(*) as total_ratings,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_ratings,
        COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_ratings
      FROM answer_ratings
      WHERE answer_id = $1
    `;
    const result = await pool.query(query, [answerId]);
    return result.rows[0];
  }

  // Check if user has rated this answer
  static async hasUserRated(answerId, userId) {
    const query = 'SELECT rating_id FROM answer_ratings WHERE answer_id = $1 AND user_id = $2';
    const result = await pool.query(query, [answerId, userId]);
    return result.rows.length > 0;
  }

  // Get top rated answers
  static async getTopRated(limit = 10) {
    const query = `
      SELECT a.*, u.full_name as expert_name, u.username as expert_username,
             q.title as question_title, q.question_id,
             AVG(ar.rating) as average_rating, COUNT(ar.rating_id) as rating_count
      FROM answers a
      JOIN users u ON a.expert_id = u.user_id
      JOIN anonymous_questions q ON a.question_id = q.question_id
      LEFT JOIN answer_ratings ar ON a.answer_id = ar.answer_id
      GROUP BY a.answer_id, u.user_id, q.question_id
      HAVING COUNT(ar.rating_id) >= 3
      ORDER BY AVG(ar.rating) DESC, COUNT(ar.rating_id) DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = Answer;
