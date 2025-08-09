import api from './baseService';

// Category interface matching the backend response
export interface Category {
  category_id: number;
  name: string;
  description?: string;
  color?: string;
  challenge_count: number;
  question_count: number;
  expert_count: number;
  created_at?: string;
  updated_at?: string;
}

// API response wrapper for categories
export interface CategoryResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

// Category statistics interface
export interface CategoryStats {
  total_categories: number;
  total_challenges: number;
  total_questions: number;
  total_experts: number;
}

class CategoryService {
  /**
   * Get all categories with their statistics
   * @returns Promise<Category[]> - Array of categories with counts
   */
  async getAll(): Promise<Category[]> {
    try {
      const response = await api.get('/categories');
      
      // Handle different response formats from backend
      if (response.data.success !== undefined) {
        // If backend returns { success: true, data: [...] }
        return response.data.data || response.data;
      } else if (Array.isArray(response.data)) {
        // If backend returns categories array directly
        return response.data;
      } else {
        // If backend returns { categories: [...] }
        return response.data.categories || [];
      }
    } catch (error: any) {
      console.error('CategoryService.getAll error:', error);
      
      // Enhanced error handling
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Failed to load categories';
        
        if (status === 401) {
          throw new Error('Authentication required. Please login again.');
        } else if (status === 403) {
          throw new Error('Access denied. Insufficient permissions.');
        } else if (status === 404) {
          throw new Error('Categories endpoint not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(message);
        }
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to load categories. Please try again.');
      }
    }
  }

  /**
   * Get a specific category by ID
   * @param categoryId - The ID of the category to fetch
   * @returns Promise<Category> - Single category with details
   */
  async getById(categoryId: number): Promise<Category> {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      
      if (response.data.success !== undefined) {
        return response.data.data || response.data;
      } else {
        return response.data;
      }
    } catch (error: any) {
      console.error('CategoryService.getById error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Category not found.');
      } else {
        throw new Error('Failed to load category details.');
      }
    }
  }

  /**
   * Get categories with pagination
   * @param page - Page number (starting from 1)
   * @param limit - Number of categories per page
   * @returns Promise<{categories: Category[], total: number, page: number, totalPages: number}>
   */
  async getPaginated(page: number = 1, limit: number = 10) {
    try {
      const response = await api.get(`/categories?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('CategoryService.getPaginated error:', error);
      throw new Error('Failed to load categories.');
    }
  }

  /**
   * Search categories by name
   * @param searchTerm - The search term to filter categories
   * @returns Promise<Category[]> - Filtered categories
   */
  async search(searchTerm: string): Promise<Category[]> {
    try {
      const response = await api.get(`/categories/search?q=${encodeURIComponent(searchTerm)}`);
      
      if (response.data.success !== undefined) {
        return response.data.data || response.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data.categories || [];
      }
    } catch (error: any) {
      console.error('CategoryService.search error:', error);
      throw new Error('Failed to search categories.');
    }
  }

  /**
   * Get overall statistics across all categories
   * @returns Promise<CategoryStats> - Aggregated statistics
   */
  async getStats(): Promise<CategoryStats> {
    try {
      const response = await api.get('/categories/stats');
      return response.data;
    } catch (error: any) {
      console.error('CategoryService.getStats error:', error);
      
      // Fallback: calculate stats from categories list
      try {
        const categories = await this.getAll();
        const stats: CategoryStats = {
          total_categories: categories.length,
          total_challenges: categories.reduce((sum, cat) => sum + (cat.challenge_count || 0), 0),
          total_questions: categories.reduce((sum, cat) => sum + (cat.question_count || 0), 0),
          total_experts: categories.reduce((sum, cat) => sum + (cat.expert_count || 0), 0),
        };
        return stats;
      } catch (fallbackError) {
        throw new Error('Failed to load category statistics.');
      }
    }
  }

  /**
   * Create a new category (admin/expert only)
   * @param categoryData - Category information
   * @returns Promise<Category> - Created category
   */
  async create(categoryData: { name: string; description?: string; color?: string }): Promise<Category> {
    try {
      const response = await api.post('/categories', categoryData);
      
      if (response.data.success !== undefined) {
        return response.data.data || response.data;
      } else {
        return response.data;
      }
    } catch (error: any) {
      console.error('CategoryService.create error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Permission denied. Only experts can create categories.');
      } else if (error.response?.status === 409) {
        throw new Error('Category with this name already exists.');
      } else {
        throw new Error('Failed to create category.');
      }
    }
  }

  /**
   * Update an existing category (admin/expert only)
   * @param categoryId - ID of category to update
   * @param categoryData - Updated category information
   * @returns Promise<Category> - Updated category
   */
  async update(categoryId: number, categoryData: { name?: string; description?: string; color?: string }): Promise<Category> {
    try {
      const response = await api.put(`/categories/${categoryId}`, categoryData);
      
      if (response.data.success !== undefined) {
        return response.data.data || response.data;
      } else {
        return response.data;
      }
    } catch (error: any) {
      console.error('CategoryService.update error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Permission denied. Only experts can update categories.');
      } else if (error.response?.status === 404) {
        throw new Error('Category not found.');
      } else {
        throw new Error('Failed to update category.');
      }
    }
  }

  /**
   * Delete a category (admin only)
   * @param categoryId - ID of category to delete
   * @returns Promise<void>
   */
  async delete(categoryId: number): Promise<void> {
    try {
      await api.delete(`/categories/${categoryId}`);
    } catch (error: any) {
      console.error('CategoryService.delete error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Permission denied. Only administrators can delete categories.');
      } else if (error.response?.status === 404) {
        throw new Error('Category not found.');
      } else if (error.response?.status === 409) {
        throw new Error('Cannot delete category with existing challenges or questions.');
      } else {
        throw new Error('Failed to delete category.');
      }
    }
  }
}

// Export singleton instance
export const categoryService = new CategoryService();

// Export default for convenience
export default categoryService;
