 
const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user profile (protected route)
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;