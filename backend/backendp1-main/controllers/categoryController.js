const Category = require('../models/categoryModel');

const categoryController = {
  // Get all categories
  getAll: async (req, res) => {
    try {
      const categories = await Category.getAll();
      res.json(categories);
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get category by ID
  getById: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.getById(categoryId);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get top-level categories
  getTopLevel: async (req, res) => {
    try {
      const categories = await Category.getTopLevel();
      res.json(categories);
    } catch (error) {
      console.error('Get top-level categories error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get experts in a category
  getExperts: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const experts = await Category.getExperts(categoryId);
      res.json(experts);
    } catch (error) {
      console.error('Get category experts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get category statistics
  getStatistics: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const stats = await Category.getStatistics(categoryId);
      res.json(stats);
    } catch (error) {
      console.error('Get category statistics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Search categories
  search: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'Search term is required' });
      }
      
      const categories = await Category.search(q.trim());
      res.json(categories);
    } catch (error) {
      console.error('Search categories error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create new category (admin only)
  create: async (req, res) => {
    try {
      const { name, description, color, icon } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }
      
      const categoryData = { name, description, color, icon };
      const newCategory = await Category.create(categoryData);
      
      res.status(201).json({
        message: 'Category created successfully',
        category: newCategory
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update category (admin only)
  update: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { name, description, color, icon } = req.body;
      
      const updateData = { name, description, color, icon };
      const updatedCategory = await Category.update(categoryId, updateData);
      
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json({
        message: 'Category updated successfully',
        category: updatedCategory
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete category (admin only)
  delete: async (req, res) => {
    try {
      const { categoryId } = req.params;
      
      const deletedCategory = await Category.delete(categoryId);
      
      if (!deletedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json({
        message: 'Category deleted successfully',
        category: deletedCategory
      });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = categoryController;
