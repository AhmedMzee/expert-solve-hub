const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all categories (public)
router.get('/', categoryController.getAll);

// Get top-level categories (public)
router.get('/top-level', categoryController.getTopLevel);

// Search categories (public)
router.get('/search', categoryController.search);

// Get category by ID (public)
router.get('/:categoryId', categoryController.getById);

// Get experts in a category (public)
router.get('/:categoryId/experts', categoryController.getExperts);

// Get category statistics (public)
router.get('/:categoryId/statistics', categoryController.getStatistics);

// Create new category (admin only - for now, any authenticated user)
router.post('/', authenticateToken, categoryController.create);

// Update category (admin only - for now, any authenticated user)
router.put('/:categoryId', authenticateToken, categoryController.update);

// Delete category (admin only - for now, any authenticated user)
router.delete('/:categoryId', authenticateToken, categoryController.delete);

module.exports = router;
