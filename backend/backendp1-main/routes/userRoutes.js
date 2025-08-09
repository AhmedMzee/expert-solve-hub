const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all experts (public)
router.get('/experts', userController.getAllExperts);

// Get user by ID (public)
router.get('/:userId', userController.getUserById);

// Update current user profile (protected)
router.put('/profile', authenticateToken, userController.updateProfile);

module.exports = router;