const pool = require('../config/database');

class Question {
  static async create(questionData) {
    const { title, content, categoryId, askedById } = questionData;
    
    const query = `
      INSERT INTO anonymous_questions (title, content, category_id, asked_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [title, content, categoryId, askedById];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = `
      SELECT q.*, u.username as asked_by_username, u.full_name as asked_by_name,
             cat.name as category_name, cat.color as category_color,
             COUNT(a.answer_id) as answer_count
      FROM anonymous_questions q
      LEFT JOIN users u ON q.asked_by = u.user_id
      LEFT JOIN categories cat ON q.category_id = cat.category_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      GROUP BY q.question_id, u.user_id, cat.category_id
      ORDER BY q.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(questionId) {
    const query = `
      SELECT q.*, u.username as asked_by_username, u.full_name as asked_by_name,
             cat.name as category_name, cat.color as category_color,
             COUNT(a.answer_id) as answer_count
      FROM anonymous_questions q
      LEFT JOIN users u ON q.asked_by = u.user_id
      LEFT JOIN categories cat ON q.category_id = cat.category_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      WHERE q.question_id = $1
      GROUP BY q.question_id, u.user_id, cat.category_id
    `;
    const result = await pool.query(query, [questionId]);
    return result.rows[0];
  }

  static async getByUser(userId) {
    const query = `
      SELECT q.*, cat.name as category_name, cat.color as category_color,
             COUNT(a.answer_id) as answer_count
      FROM anonymous_questions q
      LEFT JOIN categories cat ON q.category_id = cat.category_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      WHERE q.asked_by = $1
      GROUP BY q.question_id, cat.category_id
      ORDER BY q.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getByCategory(categoryId) {
    const query = `
      SELECT q.*, u.username as asked_by_username, u.full_name as asked_by_name,
             cat.name as category_name, cat.color as category_color,
             COUNT(a.answer_id) as answer_count
      FROM anonymous_questions q
      LEFT JOIN users u ON q.asked_by = u.user_id
      LEFT JOIN categories cat ON q.category_id = cat.category_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      WHERE q.category_id = $1
      GROUP BY q.question_id, u.user_id, cat.category_id
      ORDER BY q.created_at DESC
    `;
    const result = await pool.query(query, [categoryId]);
    return result.rows;
  }

  static async update(questionId, updateData) {
    const { title, content, categoryId } = updateData;
    
    const query = `
      UPDATE anonymous_questions 
      SET title = $1, content = $2, category_id = $3, updated_at = CURRENT_TIMESTAMP
      WHERE question_id = $4
      RETURNING *
    `;
    
    const values = [title, content, categoryId, questionId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(questionId) {
    const query = 'DELETE FROM anonymous_questions WHERE question_id = $1 RETURNING *';
    const result = await pool.query(query, [questionId]);
    return result.rows[0];
  }

  // Get question with answers
  static async getWithAnswers(questionId) {
    const questionQuery = `
      SELECT q.*, u.username as asked_by_username, u.full_name as asked_by_name,
             cat.name as category_name, cat.color as category_color
      FROM anonymous_questions q
      LEFT JOIN users u ON q.asked_by = u.user_id
      LEFT JOIN categories cat ON q.category_id = cat.category_id
      WHERE q.question_id = $1
    `;

    const answersQuery = `
      SELECT a.*, u.full_name as expert_name, u.username as expert_username,
             AVG(ar.rating) as average_rating, COUNT(ar.rating_id) as rating_count
      FROM answers a
      JOIN users u ON a.expert_id = u.user_id
      LEFT JOIN answer_ratings ar ON a.answer_id = ar.answer_id
      WHERE a.question_id = $1
      GROUP BY a.answer_id, u.user_id
      ORDER BY a.created_at ASC
    `;

    const questionResult = await pool.query(questionQuery, [questionId]);
    const answersResult = await pool.query(answersQuery, [questionId]);

    if (questionResult.rows.length === 0) {
      return null;
    }

    return {
      ...questionResult.rows[0],
      answers: answersResult.rows
    };
  }

  // Search questions
  static async search(searchTerm) {
    const query = `
      SELECT q.*, u.username as asked_by_username, u.full_name as asked_by_name,
             cat.name as category_name, cat.color as category_color,
             COUNT(a.answer_id) as answer_count
      FROM anonymous_questions q
      LEFT JOIN users u ON q.asked_by = u.user_id
      LEFT JOIN categories cat ON q.category_id = cat.category_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      WHERE q.title ILIKE $1 OR q.content ILIKE $1
      GROUP BY q.question_id, u.user_id, cat.category_id
      ORDER BY q.created_at DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}

module.exports = Question;
