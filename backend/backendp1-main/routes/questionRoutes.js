 
const express = require('express');
const questionController = require('../controllers/questionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all anonymous questions (public)
router.get('/', questionController.getAllQuestions);

// Get question by ID (public)
router.get('/:questionId', questionController.getQuestionById);

// Create new anonymous question (authenticated users only)
router.post('/', authenticateToken, questionController.createQuestion);

// Get current user's questions (authenticated users only)
router.get('/user/my-questions', authenticateToken, questionController.getMyQuestions);

// Delete own question (authenticated users only)
router.delete('/:questionId', authenticateToken, questionController.deleteQuestion);

module.exports = router;