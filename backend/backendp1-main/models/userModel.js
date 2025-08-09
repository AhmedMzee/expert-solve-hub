const pool = require('../config/database');

class User {
  static async create(userData) {
    const { email, password, fullName, username, bio, userType, profilePicture } = userData;
    
    const query = `
      INSERT INTO users (email, password_hash, full_name, username, bio, user_type, profile_picture)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING user_id, email, full_name, username, bio, user_type, profile_picture, created_at, updated_at
    `;
    
    const values = [email, password, fullName, username, bio, userType, profilePicture];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(userId) {
    const query = `
      SELECT user_id, email, full_name, username, bio, user_type, profile_picture, created_at, updated_at
      FROM users WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async getAllExperts() {
    const query = `
      SELECT u.user_id, u.email, u.full_name, u.username, u.bio, u.user_type, u.profile_picture, u.created_at,
             ARRAY_AGG(c.name) as expertise_areas
      FROM users u
      LEFT JOIN user_expertise ue ON u.user_id = ue.user_id
      LEFT JOIN categories c ON ue.category_id = c.category_id
      WHERE u.user_type = 'expert'
      GROUP BY u.user_id, u.email, u.full_name, u.username, u.bio, u.user_type, u.profile_picture, u.created_at
      ORDER BY u.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async updateProfile(userId, updateData) {
    const { fullName, username, bio, profilePicture } = updateData;
    
    const query = `
      UPDATE users 
      SET full_name = $1, username = $2, bio = $3, profile_picture = $4, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $5
      RETURNING user_id, email, full_name, username, bio, user_type, profile_picture, created_at, updated_at
    `;
    
    const values = [fullName, username, bio, profilePicture, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Add user expertise
  static async addExpertise(userId, categoryIds) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // First remove existing expertise
      await client.query('DELETE FROM user_expertise WHERE user_id = $1', [userId]);
      
      // Add new expertise
      for (const categoryId of categoryIds) {
        await client.query(
          'INSERT INTO user_expertise (user_id, category_id) VALUES ($1, $2)',
          [userId, categoryId]
        );
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get user with expertise
  static async getUserWithExpertise(userId) {
    const query = `
      SELECT u.*, ARRAY_AGG(c.name) as expertise_areas, ARRAY_AGG(c.category_id) as expertise_ids
      FROM users u
      LEFT JOIN user_expertise ue ON u.user_id = ue.user_id
      LEFT JOIN categories c ON ue.category_id = c.category_id
      WHERE u.user_id = $1
      GROUP BY u.user_id
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  // Follow/Unfollow users
  static async followUser(followerId, followingId) {
    const query = `
      INSERT INTO user_follows (follower_id, following_id)
      VALUES ($1, $2)
      ON CONFLICT (follower_id, following_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [followerId, followingId]);
    return result.rows[0];
  }

  static async unfollowUser(followerId, followingId) {
    const query = 'DELETE FROM user_follows WHERE follower_id = $1 AND following_id = $2';
    const result = await pool.query(query, [followerId, followingId]);
    return result.rowCount > 0;
  }

  // Get user's followers/following
  static async getFollowers(userId) {
    const query = `
      SELECT u.user_id, u.full_name, u.username, u.profile_picture
      FROM users u
      JOIN user_follows uf ON u.user_id = uf.follower_id
      WHERE uf.following_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getFollowing(userId) {
    const query = `
      SELECT u.user_id, u.full_name, u.username, u.profile_picture
      FROM users u
      JOIN user_follows uf ON u.user_id = uf.following_id
      WHERE uf.follower_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = User;