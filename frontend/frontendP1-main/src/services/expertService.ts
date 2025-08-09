import api from './baseService';

export interface Expert {
  user_id: number;
  email: string;
  full_name: string;
  username: string;
  bio: string;
  user_type: 'expert';
  expertise_areas: string[];
  profile_image_url?: string;
  location?: string;
  company?: string;
  website?: string;
  github_profile?: string;
  linkedin_profile?: string;
  years_experience: number;
  hourly_rate?: number;
  availability_status: 'available' | 'busy' | 'offline';
  created_at: string;
  updated_at: string;
}

export interface ExpertStats {
  total_answers: number;
  accepted_answers: number;
  total_upvotes: number;
  questions_answered: number;
  challenges_created: number;
  mentorship_sessions: number;
  average_rating: number;
  response_time_hours: number;
  followers_count: number;
  following_count: number;
}

export interface ExpertProfile extends Expert {
  stats: ExpertStats;
  recent_answers: Array<{
    answer_id: number;
    question_id: number;
    question_title: string;
    content: string;
    created_at: string;
    upvotes_count: number;
    is_accepted: boolean;
  }>;
  recent_challenges: Array<{
    challenge_id: number;
    title: string;
    difficulty_level: string;
    participant_count: number;
    created_at: string;
  }>;
}

export interface ExpertFilters {
  expertise_area?: string;
  availability_status?: 'available' | 'busy' | 'offline';
  min_experience?: number;
  max_hourly_rate?: number;
  min_rating?: number;
  location?: string;
  search?: string;
  sort_by?: 'rating' | 'experience' | 'answers' | 'newest' | 'price_low' | 'price_high';
  limit?: number;
  offset?: number;
}

export interface ExpertSearchResult {
  experts: Expert[];
  total: number;
  hasMore: boolean;
  filters: {
    available_expertise_areas: string[];
    available_locations: string[];
    experience_range: { min: number; max: number };
    rate_range: { min: number; max: number };
  };
}

class ExpertService {
  // ==========================
  // EXPERT DISCOVERY
  // ==========================

  /**
   * Get all experts with filtering and pagination
   */
  async getAll(filters: ExpertFilters = {}): Promise<ExpertSearchResult> {
    try {
      const params = new URLSearchParams();
      
      if (filters.expertise_area) params.append('expertise_area', filters.expertise_area);
      if (filters.availability_status) params.append('availability_status', filters.availability_status);
      if (filters.min_experience) params.append('min_experience', filters.min_experience.toString());
      if (filters.max_hourly_rate) params.append('max_hourly_rate', filters.max_hourly_rate.toString());
      if (filters.min_rating) params.append('min_rating', filters.min_rating.toString());
      if (filters.location) params.append('location', filters.location);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await api.get(`/users/experts?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Get experts error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load experts');
    }
  }

  /**
   * Get expert profile with detailed information
   */
  async getProfile(expertId: number): Promise<ExpertProfile> {
    try {
      const response = await api.get(`/users/experts/${expertId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get expert profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load expert profile');
    }
  }

  /**
   * Search experts by expertise, name, or company
   */
  async search(query: string, filters: Omit<ExpertFilters, 'search'> = {}): Promise<ExpertSearchResult> {
    try {
      const searchFilters = { ...filters, search: query };
      return await this.getAll(searchFilters);
    } catch (error: any) {
      console.error('Search experts error:', error);
      throw new Error(error.response?.data?.message || 'Expert search failed');
    }
  }

  /**
   * Get experts by expertise area
   */
  async getByExpertise(expertiseArea: string, limit: number = 20): Promise<Expert[]> {
    try {
      const result = await this.getAll({
        expertise_area: expertiseArea,
        limit,
        sort_by: 'rating'
      });
      return result.experts;
    } catch (error: any) {
      console.error('Get experts by expertise error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load experts');
    }
  }

  /**
   * Get top-rated experts
   */
  async getTopRated(limit: number = 10): Promise<Expert[]> {
    try {
      const result = await this.getAll({
        limit,
        sort_by: 'rating',
        min_rating: 4.0
      });
      return result.experts;
    } catch (error: any) {
      console.error('Get top rated experts error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load top experts');
    }
  }

  /**
   * Get available experts for immediate help
   */
  async getAvailable(expertiseArea?: string, limit: number = 15): Promise<Expert[]> {
    try {
      const result = await this.getAll({
        availability_status: 'available',
        expertise_area: expertiseArea,
        limit,
        sort_by: 'rating'
      });
      return result.experts;
    } catch (error: any) {
      console.error('Get available experts error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load available experts');
    }
  }

  // ==========================
  // EXPERT INTERACTION
  // ==========================

  /**
   * Follow an expert
   */
  async followExpert(expertId: number): Promise<{ following: boolean; followers_count: number }> {
    try {
      const response = await api.post(`/users/experts/${expertId}/follow`);
      return response.data;
    } catch (error: any) {
      console.error('Follow expert error:', error);
      throw new Error(error.response?.data?.message || 'Failed to follow expert');
    }
  }

  /**
   * Unfollow an expert
   */
  async unfollowExpert(expertId: number): Promise<{ following: boolean; followers_count: number }> {
    try {
      const response = await api.delete(`/users/experts/${expertId}/follow`);
      return response.data;
    } catch (error: any) {
      console.error('Unfollow expert error:', error);
      throw new Error(error.response?.data?.message || 'Failed to unfollow expert');
    }
  }

  /**
   * Rate an expert (after interaction)
   */
  async rateExpert(expertId: number, rating: number, review?: string): Promise<void> {
    try {
      await api.post(`/users/experts/${expertId}/rate`, { rating, review });
    } catch (error: any) {
      console.error('Rate expert error:', error);
      throw new Error(error.response?.data?.message || 'Failed to rate expert');
    }
  }

  /**
   * Request mentorship session with expert
   */
  async requestMentorship(expertId: number, message: string, sessionType: 'question' | 'code_review' | 'career_advice'): Promise<{
    request_id: number;
    status: 'pending' | 'accepted' | 'declined';
  }> {
    try {
      const response = await api.post(`/users/experts/${expertId}/mentorship-request`, {
        message,
        session_type: sessionType
      });
      return response.data;
    } catch (error: any) {
      console.error('Request mentorship error:', error);
      throw new Error(error.response?.data?.message || 'Failed to request mentorship');
    }
  }

  // ==========================
  // EXPERT CONTENT
  // ==========================

  /**
   * Get expert's recent answers
   */
  async getExpertAnswers(expertId: number, limit: number = 10): Promise<Array<{
    answer_id: number;
    question_id: number;
    question_title: string;
    content: string;
    created_at: string;
    upvotes_count: number;
    is_accepted: boolean;
  }>> {
    try {
      const response = await api.get(`/users/experts/${expertId}/answers?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Get expert answers error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load expert answers');
    }
  }

  /**
   * Get expert's created challenges
   */
  async getExpertChallenges(expertId: number, limit: number = 10): Promise<Array<{
    challenge_id: number;
    title: string;
    description: string;
    difficulty_level: string;
    participant_count: number;
    created_at: string;
  }>> {
    try {
      const response = await api.get(`/users/experts/${expertId}/challenges?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Get expert challenges error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load expert challenges');
    }
  }

  /**
   * Get expert's reviews and ratings
   */
  async getExpertReviews(expertId: number, limit: number = 10): Promise<Array<{
    review_id: number;
    reviewer_name: string;
    rating: number;
    review: string;
    created_at: string;
    session_type: string;
  }>> {
    try {
      const response = await api.get(`/users/experts/${expertId}/reviews?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Get expert reviews error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load expert reviews');
    }
  }

  // ==========================
  // EXPERT MANAGEMENT (For Expert Users)
  // ==========================

  /**
   * Update expert profile (only for the expert themselves)
   */
  async updateProfile(profileData: Partial<{
    bio: string;
    expertise_areas: string[];
    location: string;
    company: string;
    website: string;
    github_profile: string;
    linkedin_profile: string;
    years_experience: number;
    hourly_rate: number;
    availability_status: 'available' | 'busy' | 'offline';
  }>): Promise<Expert> {
    try {
      const response = await api.put('/users/experts/profile', profileData);
      return response.data;
    } catch (error: any) {
      console.error('Update expert profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  /**
   * Get expert's mentorship requests
   */
  async getMentorshipRequests(): Promise<Array<{
    request_id: number;
    requester_name: string;
    message: string;
    session_type: string;
    status: 'pending' | 'accepted' | 'declined';
    created_at: string;
  }>> {
    try {
      const response = await api.get('/users/experts/mentorship-requests');
      return response.data;
    } catch (error: any) {
      console.error('Get mentorship requests error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load mentorship requests');
    }
  }

  /**
   * Respond to mentorship request
   */
  async respondToMentorshipRequest(requestId: number, status: 'accepted' | 'declined', response?: string): Promise<void> {
    try {
      await api.put(`/users/experts/mentorship-requests/${requestId}`, { status, response });
    } catch (error: any) {
      console.error('Respond to mentorship request error:', error);
      throw new Error(error.response?.data?.message || 'Failed to respond to request');
    }
  }

  // ==========================
  // STATISTICS & ANALYTICS
  // ==========================

  /**
   * Get expert statistics
   */
  async getExpertStats(expertId: number): Promise<ExpertStats> {
    try {
      const response = await api.get(`/users/experts/${expertId}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Get expert stats error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load expert statistics');
    }
  }

  /**
   * Get expert leaderboard
   */
  async getLeaderboard(category: 'answers' | 'rating' | 'helpfulness' = 'rating', limit: number = 10): Promise<Array<Expert & { rank: number; score: number }>> {
    try {
      const response = await api.get(`/users/experts/leaderboard?category=${category}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Get expert leaderboard error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load leaderboard');
    }
  }

  /**
   * Get expertise areas with expert counts
   */
  async getExpertiseAreas(): Promise<Array<{
    area: string;
    expert_count: number;
    avg_rating: number;
    avg_hourly_rate: number;
  }>> {
    try {
      const response = await api.get('/users/experts/expertise-areas');
      return response.data;
    } catch (error: any) {
      console.error('Get expertise areas error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load expertise areas');
    }
  }

  // ==========================
  // UTILITY METHODS
  // ==========================

  /**
   * Check if current user is following an expert
   */
  async isFollowing(expertId: number): Promise<boolean> {
    try {
      const response = await api.get(`/users/experts/${expertId}/follow-status`);
      return response.data.following;
    } catch (error: any) {
      console.error('Check following status error:', error);
      return false;
    }
  }

  /**
   * Get similar experts based on expertise
   */
  async getSimilarExperts(expertId: number, limit: number = 5): Promise<Expert[]> {
    try {
      const response = await api.get(`/users/experts/${expertId}/similar?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Get similar experts error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load similar experts');
    }
  }

  /**
   * Report an expert
   */
  async reportExpert(expertId: number, reason: string, details?: string): Promise<void> {
    try {
      await api.post('/reports', {
        content_type: 'expert',
        content_id: expertId,
        reason,
        details
      });
    } catch (error: any) {
      console.error('Report expert error:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit report');
    }
  }
}

// Export singleton instance
export const expertService = new ExpertService();
