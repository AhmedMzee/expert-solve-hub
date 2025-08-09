 
const express = require('express');
const answerController = require('../controllers/answerController');
const { authenticateToken, requireExpert } = require('../middleware/auth');

const router = express.Router();

// Get answer by ID (public)
router.get('/:answerId', answerController.getAnswerById);

// Get answers for a specific question (public)
router.get('/question/:questionId', answerController.getAnswersByQuestion);

// Get answers by expert ID (public)
router.get('/expert/:expertId', answerController.getAnswersByExpert);

// Create new answer for a question (experts only)
router.post('/question/:questionId', authenticateToken, requireExpert, answerController.createAnswer);

// Get current expert's answers (experts only)
router.get('/user/my-answers', authenticateToken, requireExpert, answerController.getMyAnswers);

// Update own answer (experts only)
router.put('/:answerId', authenticateToken, requireExpert, answerController.updateAnswer);

// Delete own answer (experts only)
router.delete('/:answerId', authenticateToken, requireExpert, answerController.deleteAnswer);

module.exports = router;