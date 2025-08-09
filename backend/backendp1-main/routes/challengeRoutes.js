 
const express = require('express');
const challengeController = require('../controllers/challengeController');
const { authenticateToken, requireExpert } = require('../middleware/auth');

const router = express.Router();

// Get all challenges (public)
router.get('/', challengeController.getAllChallenges);

// Get challenge by ID with solutions (public)
router.get('/:challengeId', challengeController.getChallengeById);

// Get challenges by expert ID (public)
router.get('/expert/:expertId', challengeController.getChallengesByExpert);

// Get solutions for a challenge (public)
router.get('/:challengeId/solutions', challengeController.getSolutions);

// Create new challenge (experts only)
router.post('/', authenticateToken, requireExpert, challengeController.createChallenge);

// Create solution for a challenge (experts only)
router.post('/:challengeId/solutions', authenticateToken, requireExpert, challengeController.createSolution);

module.exports = router;