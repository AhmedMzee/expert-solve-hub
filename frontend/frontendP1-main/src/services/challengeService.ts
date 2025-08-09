import api from './baseService';

// Challenge interface matching the backend response
export interface Challenge {
  challenge_id: number;
  title: string;
  description: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  creator_id: number;
  creator_name: string;
  category_id: number;
  category_name: string;
  participant_count: number;
  status: 'active' | 'completed' | 'draft';
  created_at: string;
  updated_at: string;
  problem_statement?: string;
  expected_output?: string;
  test_cases?: string;
  time_limit?: number; // in minutes
  programming_language?: string;
  starter_code?: string;
}

// Challenge creation/update interface
export interface CreateChallengeData {
  title: string;
  description: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  category_id: number;
  problem_statement: string;
  expected_output?: string;
  test_cases?: string;
  time_limit?: number;
  programming_language?: string;
  starter_code?: string;
}

// Challenge submission interface
export interface ChallengeSubmission {
  submission_id: number;
  challenge_id: number;
  user_id: number;
  user_name: string;
  code: string;
  programming_language: string;
  status: 'pending' | 'passed' | 'failed';
  score?: number;
  submitted_at: string;
  execution_time?: number;
  error_message?: string;
}

// Challenge participation interface
export interface ChallengeParticipation {
  participation_id: number;
  challenge_id: number;
  user_id: number;
  user_name: string;
  joined_at: string;
  status: 'active' | 'completed' | 'abandoned';
  best_submission?: ChallengeSubmission;
}

// API response wrapper for challenges
export interface ChallengeResponse {
  success: boolean;
  data: Challenge[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ChallengeService {
  /**
   * Get all challenges with optional filtering
   * @param filters - Optional filters for challenges
   * @returns Promise<Challenge[]> - Array of challenges
   */
  async getAll(filters?: {
    category_id?: number;
    difficulty_level?: 'easy' | 'medium' | 'hard';
    status?: 'active' | 'completed' | 'draft';
    creator_id?: number;
  }): Promise<Challenge[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const queryString = params.toString();
      const url = queryString ? `/challenges?${queryString}` : '/challenges';
      
      const response = await api.get(url);
      
      // Handle different response formats from backend
      if (response.data.success !== undefined) {
        // If backend returns { success: true, data: [...] }
        return response.data.data || response.data;
      } else if (Array.isArray(response.data)) {
        // If backend returns challenges array directly
        return response.data;
      } else {
        // If backend returns { challenges: [...] }
        return response.data.challenges || [];
      }
    } catch (error: any) {
      console.error('ChallengeService.getAll error:', error);
      
      // Enhanced error handling
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Failed to load challenges';
        
        if (status === 401) {
          throw new Error('Authentication required. Please login again.');
        } else if (status === 403) {
          throw new Error('Access denied. Insufficient permissions.');
        } else if (status === 404) {
          throw new Error('Challenges endpoint not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(message);
        }
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to load challenges. Please try again.');
      }
    }
  }

  /**
   * Get a specific challenge by ID with full details
   * @param challengeId - The ID of the challenge to fetch
   * @returns Promise<Challenge> - Single challenge with details
   */
  async getById(challengeId: number): Promise<Challenge> {
    try {
      const response = await api.get(`/challenges/${challengeId}`);
      
      if (response.data.success !== undefined) {
        return response.data.data || response.data;
      } else {
        return response.data;
      }
    } catch (error: any) {
      console.error('ChallengeService.getById error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Challenge not found.');
      } else {
        throw new Error('Failed to load challenge details.');
      }
    }
  }

  /**
   * Get challenges with pagination
   * @param page - Page number (starting from 1)
   * @param limit - Number of challenges per page
   * @param filters - Optional filters
   * @returns Promise with challenges and pagination info
   */
  async getPaginated(
    page: number = 1, 
    limit: number = 10,
    filters?: {
      category_id?: number;
      difficulty_level?: 'easy' | 'medium' | 'hard';
      status?: 'active' | 'completed' | 'draft';
    }
  ) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get(`/challenges?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('ChallengeService.getPaginated error:', error);
      throw new Error('Failed to load challenges.');
    }
  }

  /**
   * Search challenges by title or description
   * @param searchTerm - The search term to filter challenges
   * @returns Promise<Challenge[]> - Filtered challenges
   */
  async search(searchTerm: string): Promise<Challenge[]> {
    try {
      const response = await api.get(`/challenges/search?q=${encodeURIComponent(searchTerm)}`);
      
      if (response.data.success !== undefined) {
        return response.data.data || response.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data.challenges || [];
      }
    } catch (error: any) {
      console.error('ChallengeService.search error:', error);
      throw new Error('Failed to search challenges.');
    }
  }

  /**
   * Get challenges by category
   * @param categoryId - The category ID to filter by
   * @returns Promise<Challenge[]> - Challenges in the category
   */
  async getByCategory(categoryId: number): Promise<Challenge[]> {
    return this.getAll({ category_id: categoryId });
  }

  /**
   * Get challenges by difficulty level
   * @param difficulty - The difficulty level to filter by
   * @returns Promise<Challenge[]> - Challenges of the specified difficulty
   */
  async getByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<Challenge[]> {
    return this.getAll({ difficulty_level: difficulty });
  }

  /**
   * Create a new challenge (expert/admin only)
   * @param challengeData - Challenge information
   * @returns Promise<Challenge> - Created challenge
   */
  async create(challengeData: CreateChallengeData): Promise<Challenge> {
    try {
      const response = await api.post('/challenges', challengeData);
      
      if (response.data.success !== undefined) {
        return response.data.data || response.data;
      } else {
        return response.data;
      }
    } catch (error: any) {
      console.error('ChallengeService.create error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Permission denied. Only experts can create challenges.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Invalid challenge data.');
      } else {
        throw new Error('Failed to create challenge.');
      }
    }
  }

  /**
   * Join a challenge (participate)
   * @param challengeId - ID of challenge to join
   * @returns Promise<ChallengeParticipation> - Participation record
   */
  async join(challengeId: number): Promise<ChallengeParticipation> {
    try {
      const response = await api.post(`/challenges/${challengeId}/join`);
      return response.data;
    } catch (error: any) {
      console.error('ChallengeService.join error:', error);
      
      if (error.response?.status === 409) {
        throw new Error('You are already participating in this challenge.');
      } else {
        throw new Error('Failed to join challenge.');
      }
    }
  }

  /**
   * Submit a solution to a challenge
   * @param challengeId - ID of challenge
   * @param submissionData - Code submission data
   * @returns Promise<ChallengeSubmission> - Submission result
   */
  async submitSolution(
    challengeId: number, 
    submissionData: {
      code: string;
      programming_language: string;
    }
  ): Promise<ChallengeSubmission> {
    try {
      const response = await api.post(`/challenges/${challengeId}/submit`, submissionData);
      return response.data;
    } catch (error: any) {
      console.error('ChallengeService.submitSolution error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('You must join the challenge before submitting.');
      } else {
        throw new Error('Failed to submit solution.');
      }
    }
  }

  /**
   * Get submissions for a challenge
   * @param challengeId - ID of challenge
   * @returns Promise<ChallengeSubmission[]> - List of submissions
   */
  async getSubmissions(challengeId: number): Promise<ChallengeSubmission[]> {
    try {
      const response = await api.get(`/challenges/${challengeId}/submissions`);
      return response.data;
    } catch (error: any) {
      console.error('ChallengeService.getSubmissions error:', error);
      throw new Error('Failed to load submissions.');
    }
  }

  /**
   * Get user's submissions for a challenge
   * @param challengeId - ID of challenge
   * @returns Promise<ChallengeSubmission[]> - User's submissions
   */
  async getMySubmissions(challengeId: number): Promise<ChallengeSubmission[]> {
    try {
      const response = await api.get(`/challenges/${challengeId}/my-submissions`);
      return response.data;
    } catch (error: any) {
      console.error('ChallengeService.getMySubmissions error:', error);
      throw new Error('Failed to load your submissions.');
    }
  }

  /**
   * Get participants of a challenge
   * @param challengeId - ID of challenge
   * @returns Promise<ChallengeParticipation[]> - List of participants
   */
  async getParticipants(challengeId: number): Promise<ChallengeParticipation[]> {
    try {
      const response = await api.get(`/challenges/${challengeId}/participants`);
      return response.data;
    } catch (error: any) {
      console.error('ChallengeService.getParticipants error:', error);
      throw new Error('Failed to load participants.');
    }
  }
}

// Export singleton instance
export const challengeService = new ChallengeService();

// Export default for convenience
export default challengeService;