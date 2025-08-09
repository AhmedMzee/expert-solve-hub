const pool = require('../config/database');

class Category {
  static async getAll() {
    const query = `
      SELECT c.*,
             COUNT(DISTINCT ch.challenge_id) as challenge_count,
             COUNT(DISTINCT q.question_id) as question_count,
             COUNT(DISTINCT ue.user_id) as expert_count
      FROM categories c
      LEFT JOIN challenges ch ON c.category_id = ch.category_id
      LEFT JOIN anonymous_questions q ON c.category_id = q.category_id
      LEFT JOIN user_expertise ue ON c.category_id = ue.category_id
      GROUP BY c.category_id
      ORDER BY c.name ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(categoryId) {
    const query = `
      SELECT c.*,
             COUNT(DISTINCT ch.challenge_id) as challenge_count,
             COUNT(DISTINCT q.question_id) as question_count,
             COUNT(DISTINCT ue.user_id) as expert_count
      FROM categories c
      LEFT JOIN challenges ch ON c.category_id = ch.category_id
      LEFT JOIN anonymous_questions q ON c.category_id = q.category_id
      LEFT JOIN user_expertise ue ON c.category_id = ue.category_id
      WHERE c.category_id = $1
      GROUP BY c.category_id
    `;
    const result = await pool.query(query, [categoryId]);
    return result.rows[0];
  }

  static async create(categoryData) {
    const { name, description, color, icon } = categoryData;
    
    const query = `
      INSERT INTO categories (name, description, color, icon)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [name, description, color, icon];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(categoryId, updateData) {
    const { name, description, color, icon } = updateData;
    
    const query = `
      UPDATE categories 
      SET name = $1, description = $2, color = $3, icon = $4, updated_at = CURRENT_TIMESTAMP
      WHERE category_id = $5
      RETURNING *
    `;
    
    const values = [name, description, color, icon, categoryId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(categoryId) {
    const query = 'DELETE FROM categories WHERE category_id = $1 RETURNING *';
    const result = await pool.query(query, [categoryId]);
    return result.rows[0];
  }

  // Get category with subcategories
  static async getWithSubcategories(categoryId) {
    const query = `
      SELECT c.*, 
             JSON_AGG(
               JSON_BUILD_OBJECT(
                 'category_id', sub.category_id,
                 'name', sub.name,
                 'description', sub.description,
                 'color', sub.color,
                 'icon', sub.icon
               )
             ) FILTER (WHERE sub.category_id IS NOT NULL) as subcategories
      FROM categories c
      LEFT JOIN categories sub ON c.category_id = sub.parent_category_id
      WHERE c.category_id = $1
      GROUP BY c.category_id
    `;
    const result = await pool.query(query, [categoryId]);
    return result.rows[0];
  }

  // Get top-level categories only
  static async getTopLevel() {
    const query = `
      SELECT c.*,
             COUNT(DISTINCT ch.challenge_id) as challenge_count,
             COUNT(DISTINCT q.question_id) as question_count,
             COUNT(DISTINCT ue.user_id) as expert_count
      FROM categories c
      LEFT JOIN challenges ch ON c.category_id = ch.category_id
      LEFT JOIN anonymous_questions q ON c.category_id = q.category_id
      LEFT JOIN user_expertise ue ON c.category_id = ue.category_id
      WHERE c.parent_category_id IS NULL
      GROUP BY c.category_id
      ORDER BY c.name ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get experts by category
  static async getExperts(categoryId) {
    const query = `
      SELECT u.user_id, u.full_name, u.username, u.profile_picture, u.bio
      FROM users u
      JOIN user_expertise ue ON u.user_id = ue.user_id
      WHERE ue.category_id = $1 AND u.user_type = 'expert'
      ORDER BY u.full_name ASC
    `;
    const result = await pool.query(query, [categoryId]);
    return result.rows;
  }

  // Search categories
  static async search(searchTerm) {
    const query = `
      SELECT c.*,
             COUNT(DISTINCT ch.challenge_id) as challenge_count,
             COUNT(DISTINCT q.question_id) as question_count
      FROM categories c
      LEFT JOIN challenges ch ON c.category_id = ch.category_id
      LEFT JOIN anonymous_questions q ON c.category_id = q.category_id
      WHERE c.name ILIKE $1 OR c.description ILIKE $1
      GROUP BY c.category_id
      ORDER BY c.name ASC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get category statistics
  static async getStatistics(categoryId) {
    const query = `
      SELECT 
        COUNT(DISTINCT ch.challenge_id) as total_challenges,
        COUNT(DISTINCT q.question_id) as total_questions,
        COUNT(DISTINCT ue.user_id) as total_experts,
        COUNT(DISTINCT s.solution_id) as total_solutions,
        COUNT(DISTINCT a.answer_id) as total_answers
      FROM categories c
      LEFT JOIN challenges ch ON c.category_id = ch.category_id
      LEFT JOIN anonymous_questions q ON c.category_id = q.category_id
      LEFT JOIN user_expertise ue ON c.category_id = ue.category_id
      LEFT JOIN solutions s ON ch.challenge_id = s.challenge_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      WHERE c.category_id = $1
    `;
    const result = await pool.query(query, [categoryId]);
    return result.rows[0];
  }
}

module.exports = Category;
