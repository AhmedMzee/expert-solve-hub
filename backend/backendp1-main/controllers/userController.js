 
const User = require('../models/userModel');

const userController = {
  // Get all experts
  getAllExperts: async (req, res) => {
    try {
      const experts = await User.getAllExperts();
      res.json({ experts });
    } catch (error) {
      console.error('Get experts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { fullName, username, bio, areaOfExpertise, profilePicture } = req.body;
      const userId = req.user.user_id;

      const updateData = {
        fullName,
        username,
        bio,
        areaOfExpertise,
        profilePicture
      };

      const updatedUser = await User.updateProfile(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userController;