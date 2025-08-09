 
const Challenge = require('../models/challengeModel');

const challengeController = {
  // Create new challenge (experts only)
  createChallenge: async (req, res) => {
    try {
      const { title, description } = req.body;
      const expertId = req.user.user_id;

      const challengeData = {
        expertId,
        title,
        description
      };

      const newChallenge = await Challenge.create(challengeData);
      res.status(201).json({
        message: 'Challenge created successfully',
        challenge: newChallenge
      });
    } catch (error) {
      console.error('Create challenge error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all challenges
  getAllChallenges: async (req, res) => {
    try {
      const challenges = await Challenge.getAll();
      res.json({ challenges });
    } catch (error) {
      console.error('Get challenges error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get challenge by ID
  getChallengeById: async (req, res) => {
    try {
      const { challengeId } = req.params;
      const challenge = await Challenge.getById(challengeId);
      
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      // Get solutions for this challenge
      const solutions = await Challenge.getSolutionsByChallengeId(challengeId);
      
      res.json({ 
        challenge,
        solutions 
      });
    } catch (error) {
      console.error('Get challenge error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get challenges by expert ID
  getChallengesByExpert: async (req, res) => {
    try {
      const { expertId } = req.params;
      const challenges = await Challenge.getByExpertId(expertId);
      res.json({ challenges });
    } catch (error) {
      console.error('Get expert challenges error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create solution for a challenge (experts only)
  createSolution: async (req, res) => {
    try {
      const { challengeId } = req.params;
      const { content } = req.body;
      const expertId = req.user.user_id;

      // Check if challenge exists
      const challenge = await Challenge.getById(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      const solutionData = {
        challengeId,
        expertId,
        content
      };

      const newSolution = await Challenge.createSolution(solutionData);
      res.status(201).json({
        message: 'Solution created successfully',
        solution: newSolution
      });
    } catch (error) {
      console.error('Create solution error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get solutions for a challenge
  getSolutions: async (req, res) => {
    try {
      const { challengeId } = req.params;
      const solutions = await Challenge.getSolutionsByChallengeId(challengeId);
      res.json({ solutions });
    } catch (error) {
      console.error('Get solutions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = challengeController;