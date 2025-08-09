const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { email, password, fullName, username, bio, userType, profilePicture, expertiseCategories } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userData = {
        email,
        password: hashedPassword,
        fullName,
        username,
        bio: bio || null,
        userType: userType || 'user',
        profilePicture: profilePicture || null
      };

      const newUser = await User.create(userData);

      // Add expertise categories if user is an expert
      if (userType === 'expert' && expertiseCategories && expertiseCategories.length > 0) {
        await User.addExpertise(newUser.user_id, expertiseCategories);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          user_id: newUser.user_id, 
          email: newUser.email, 
          user_type: newUser.user_type 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Get user with expertise if expert
      const userWithDetails = userType === 'expert' 
        ? await User.getUserWithExpertise(newUser.user_id)
        : newUser;

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: userWithDetails
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          user_id: user.user_id, 
          email: user.email, 
          user_type: user.user_type 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password_hash: _, ...userResponse } = user;

      res.json({
        message: 'Login successful',
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authController;