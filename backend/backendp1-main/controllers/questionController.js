 
const Question = require('../models/questionModel');

const questionController = {
  // Create new anonymous question
  createQuestion: async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.user.user_id;

      const questionData = {
        userId,
        content
      };

      const newQuestion = await Question.create(questionData);
      res.status(201).json({
        message: 'Anonymous question created successfully',
        question: {
          question_id: newQuestion.question_id,
          content: newQuestion.content,
          created_at: newQuestion.created_at
        }
      });
    } catch (error) {
      console.error('Create question error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all anonymous questions (without showing who asked)
  getAllQuestions: async (req, res) => {
    try {
      const questions = await Question.getAll();
      res.json({ questions });
    } catch (error) {
      console.error('Get questions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get question by ID (anonymous)
  getQuestionById: async (req, res) => {
    try {
      const { questionId } = req.params;
      const question = await Question.getById(questionId);
      
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      
      res.json({ question });
    } catch (error) {
      console.error('Get question error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get questions asked by current user (only they can see their own)
  getMyQuestions: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const questions = await Question.getByUserId(userId);
      res.json({ questions });
    } catch (error) {
      console.error('Get my questions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete own question
  deleteQuestion: async (req, res) => {
    try {
      const { questionId } = req.params;
      const userId = req.user.user_id;

      const deletedQuestion = await Question.delete(questionId, userId);
      
      if (!deletedQuestion) {
        return res.status(404).json({ error: 'Question not found or you do not have permission to delete it' });
      }

      res.json({
        message: 'Question deleted successfully',
        question: deletedQuestion
      });
    } catch (error) {
      console.error('Delete question error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = questionController;