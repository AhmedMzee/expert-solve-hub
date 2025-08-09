import api from './baseService';

export interface Question {
  question_id: number;
  title: string;
  content: string;
  category_id: number;
  category_name: string;
  asked_by: number;
  asked_by_name: string;
  created_at: string;
  updated_at: string;
  answer_count: number;
  is_resolved: boolean;
  tags?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  views_count: number;
  upvotes_count: number;
}

export interface Answer {
  answer_id: number;
  question_id: number;
  content: string;
  answered_by: number;
  answered_by_name: string;
  answered_by_type: 'user' | 'expert';
  created_at: string;
  updated_at: string;
  upvotes_count: number;
  is_accepted: boolean;
  is_helpful: boolean;
}

export interface QuestionDetail extends Question {
  answers: Answer[];
  asker_profile: {
    username: string;
    full_name: string;
    user_type: 'user' | 'expert';
  };
}

export interface CreateQuestionData {
  title: string;
  content: string;
  category_id: number;
  tags?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface CreateAnswerData {
  question_id: number;
  content: string;
}

export interface QuestionFilters {
  category_id?: number;
  difficulty_level?: string;
  is_resolved?: boolean;
  search?: string;
  sort_by?: 'newest' | 'oldest' | 'most_answers' | 'most_votes' | 'unanswered';
  limit?: number;
  offset?: number;
}

export interface QuestionStats {
  total_questions: number;
  resolved_questions: number;
  unanswered_questions: number;
  total_answers: number;
  expert_answers: number;
  my_questions: number;
  my_answers: number;
}

class QuestionService {
  // ==========================
  // QUESTION CRUD OPERATIONS
  // ==========================

  /**
   * Get all questions with optional filtering and pagination
   */
  async getAll(filters: QuestionFilters = {}): Promise<{
    questions: Question[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.category_id) params.append('category_id', filters.category_id.toString());
      if (filters.difficulty_level) params.append('difficulty_level', filters.difficulty_level);
      if (filters.is_resolved !== undefined) params.append('is_resolved', filters.is_resolved.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await api.get(`/questions?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Get questions error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load questions');
    }
  }

  /**
   * Get a specific question with full details including answers
   */
  async getById(questionId: number): Promise<QuestionDetail> {
    try {
      const response = await api.get(`/questions/${questionId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get question error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load question');
    }
  }

  /**
   * Create a new question
   */
  async create(questionData: CreateQuestionData): Promise<Question> {
    try {
      const response = await api.post('/questions', questionData);
      return response.data;
    } catch (error: any) {
      console.error('Create question error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create question');
    }
  }

  /**
   * Update an existing question (only by the asker)
   */
  async update(questionId: number, updateData: Partial<CreateQuestionData>): Promise<Question> {
    try {
      const response = await api.put(`/questions/${questionId}`, updateData);
      return response.data;
    } catch (error: any) {
      console.error('Update question error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update question');
    }
  }

  /**
   * Delete a question (only by the asker or admin)
   */
  async delete(questionId: number): Promise<void> {
    try {
      await api.delete(`/questions/${questionId}`);
    } catch (error: any) {
      console.error('Delete question error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete question');
    }
  }

  // ==========================
  // ANSWER OPERATIONS
  // ==========================

  /**
   * Create an answer for a question
   */
  async createAnswer(answerData: CreateAnswerData): Promise<Answer> {
    try {
      const response = await api.post('/answers', answerData);
      return response.data;
    } catch (error: any) {
      console.error('Create answer error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create answer');
    }
  }

  /**
   * Update an answer (only by the answerer)
   */
  async updateAnswer(answerId: number, content: string): Promise<Answer> {
    try {
      const response = await api.put(`/answers/${answerId}`, { content });
      return response.data;
    } catch (error: any) {
      console.error('Update answer error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update answer');
    }
  }

  /**
   * Delete an answer (only by the answerer or admin)
   */
  async deleteAnswer(answerId: number): Promise<void> {
    try {
      await api.delete(`/answers/${answerId}`);
    } catch (error: any) {
      console.error('Delete answer error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete answer');
    }
  }

  /**
   * Accept an answer as the solution (only by question asker)
   */
  async acceptAnswer(answerId: number): Promise<Answer> {
    try {
      const response = await api.post(`/answers/${answerId}/accept`);
      return response.data;
    } catch (error: any) {
      console.error('Accept answer error:', error);
      throw new Error(error.response?.data?.message || 'Failed to accept answer');
    }
  }

  // ==========================
  // VOTING OPERATIONS
  // ==========================

  /**
   * Upvote a question
   */
  async upvoteQuestion(questionId: number): Promise<{ upvotes_count: number }> {
    try {
      const response = await api.post(`/questions/${questionId}/upvote`);
      return response.data;
    } catch (error: any) {
      console.error('Upvote question error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upvote question');
    }
  }

  /**
   * Upvote an answer
   */
  async upvoteAnswer(answerId: number): Promise<{ upvotes_count: number }> {
    try {
      const response = await api.post(`/answers/${answerId}/upvote`);
      return response.data;
    } catch (error: any) {
      console.error('Upvote answer error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upvote answer');
    }
  }

  /**
   * Mark answer as helpful
   */
  async markAnswerHelpful(answerId: number): Promise<Answer> {
    try {
      const response = await api.post(`/answers/${answerId}/helpful`);
      return response.data;
    } catch (error: any) {
      console.error('Mark helpful error:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark as helpful');
    }
  }

  // ==========================
  // SEARCH & DISCOVERY
  // ==========================

  /**
   * Search questions by text query
   */
  async search(query: string, filters: Omit<QuestionFilters, 'search'> = {}): Promise<{
    questions: Question[];
    total: number;
  }> {
    try {
      const searchFilters = { ...filters, search: query };
      const result = await this.getAll(searchFilters);
      return {
        questions: result.questions,
        total: result.total
      };
    } catch (error: any) {
      console.error('Search questions error:', error);
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }

  /**
   * Get popular/trending questions
   */
  async getTrending(limit: number = 10): Promise<Question[]> {
    try {
      const response = await api.get(`/questions/trending?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Get trending questions error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load trending questions');
    }
  }

  /**
   * Get unanswered questions
   */
  async getUnanswered(categoryId?: number, limit: number = 20): Promise<Question[]> {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (categoryId) params.append('category_id', categoryId.toString());
      
      const response = await api.get(`/questions/unanswered?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Get unanswered questions error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load unanswered questions');
    }
  }

  /**
   * Get questions by category
   */
  async getByCategory(categoryId: number, limit: number = 20): Promise<Question[]> {
    try {
      const filters: QuestionFilters = {
        category_id: categoryId,
        limit,
        sort_by: 'newest'
      };
      const result = await this.getAll(filters);
      return result.questions;
    } catch (error: any) {
      console.error('Get questions by category error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load category questions');
    }
  }

  // ==========================
  // USER-SPECIFIC OPERATIONS
  // ==========================

  /**
   * Get questions asked by current user
   */
  async getMyQuestions(): Promise<Question[]> {
    try {
      const response = await api.get('/questions/my-questions');
      return response.data;
    } catch (error: any) {
      console.error('Get my questions error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load your questions');
    }
  }

  /**
   * Get answers provided by current user
   */
  async getMyAnswers(): Promise<Answer[]> {
    try {
      const response = await api.get('/answers/my-answers');
      return response.data;
    } catch (error: any) {
      console.error('Get my answers error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load your answers');
    }
  }

  /**
   * Get questions user has upvoted
   */
  async getUpvotedQuestions(): Promise<Question[]> {
    try {
      const response = await api.get('/questions/upvoted');
      return response.data;
    } catch (error: any) {
      console.error('Get upvoted questions error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load upvoted questions');
    }
  }

  // ==========================
  // STATISTICS & ANALYTICS
  // ==========================

  /**
   * Get question and answer statistics
   */
  async getStats(): Promise<QuestionStats> {
    try {
      const response = await api.get('/questions/stats');
      return response.data;
    } catch (error: any) {
      console.error('Get stats error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load statistics');
    }
  }

  /**
   * Get expert leaderboard (top answerers)
   */
  async getExpertLeaderboard(limit: number = 10): Promise<Array<{
    user_id: number;
    full_name: string;
    username: string;
    user_type: 'expert' | 'user';
    answer_count: number;
    accepted_answers: number;
    total_upvotes: number;
    helpful_answers: number;
  }>> {
    try {
      const response = await api.get(`/questions/expert-leaderboard?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Get expert leaderboard error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load expert leaderboard');
    }
  }

  // ==========================
  // UTILITY METHODS
  // ==========================

  /**
   * Get suggested tags for a question
   */
  async getSuggestedTags(content: string): Promise<string[]> {
    try {
      const response = await api.post('/questions/suggest-tags', { content });
      return response.data.tags || [];
    } catch (error: any) {
      console.error('Get suggested tags error:', error);
      return []; // Return empty array on error
    }
  }

  /**
   * Report a question or answer
   */
  async reportContent(type: 'question' | 'answer', id: number, reason: string): Promise<void> {
    try {
      await api.post('/reports', {
        content_type: type,
        content_id: id,
        reason
      });
    } catch (error: any) {
      console.error('Report content error:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit report');
    }
  }

  /**
   * Check if user can perform action (edit, delete, etc.)
   */
  async canPerformAction(action: string, questionId: number): Promise<boolean> {
    try {
      const response = await api.get(`/questions/${questionId}/permissions?action=${action}`);
      return response.data.allowed || false;
    } catch (error: any) {
      console.error('Check permissions error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const questionService = new QuestionService();
