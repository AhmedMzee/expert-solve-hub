 
const Answer = require('../models/answerModel');
const Question = require('../models/questionModel');

const answerController = {
  // Create new answer (experts only)
  createAnswer: async (req, res) => {
    try {
      const { questionId } = req.params;
      const { content } = req.body;
      const expertId = req.user.user_id;

      // Check if question exists
      const question = await Question.getById(questionId);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const answerData = {
        questionId,
        expertId,
        content
      };

      const newAnswer = await Answer.create(answerData);
      res.status(201).json({
        message: 'Answer created successfully',
        answer: newAnswer
      });
    } catch (error) {
      console.error('Create answer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get answers for a specific question
  getAnswersByQuestion: async (req, res) => {
    try {
      const { questionId } = req.params;
      const answers = await Answer.getByQuestionId(questionId);
      res.json({ answers });
    } catch (error) {
      console.error('Get answers error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get answers by expert
  getAnswersByExpert: async (req, res) => {
    try {
      const { expertId } = req.params;
      const answers = await Answer.getByExpertId(expertId);
      res.json({ answers });
    } catch (error) {
      console.error('Get expert answers error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get my answers (current expert's answers)
  getMyAnswers: async (req, res) => {
    try {
      const expertId = req.user.user_id;
      const answers = await Answer.getByExpertId(expertId);
      res.json({ answers });
    } catch (error) {
      console.error('Get my answers error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get answer by ID
  getAnswerById: async (req, res) => {
    try {
      const { answerId } = req.params;
      const answer = await Answer.getById(answerId);
      
      if (!answer) {
        return res.status(404).json({ error: 'Answer not found' });
      }
      
      res.json({ answer });
    } catch (error) {
      console.error('Get answer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update answer (only by the expert who created it)
  updateAnswer: async (req, res) => {
    try {
      const { answerId } = req.params;
      const { content } = req.body;
      const expertId = req.user.user_id;

      const updatedAnswer = await Answer.update(answerId, expertId, content);
      
      if (!updatedAnswer) {
        return res.status(404).json({ error: 'Answer not found or you do not have permission to update it' });
      }

      res.json({
        message: 'Answer updated successfully',
        answer: updatedAnswer
      });
    } catch (error) {
      console.error('Update answer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete answer (only by the expert who created it)
  deleteAnswer: async (req, res) => {
    try {
      const { answerId } = req.params;
      const expertId = req.user.user_id;

      const deletedAnswer = await Answer.delete(answerId, expertId);
      
      if (!deletedAnswer) {
        return res.status(404).json({ error: 'Answer not found or you do not have permission to delete it' });
      }

      res.json({
        message: 'Answer deleted successfully',
        answer: deletedAnswer
      });
    } catch (error) {
      console.error('Delete answer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = answerController;