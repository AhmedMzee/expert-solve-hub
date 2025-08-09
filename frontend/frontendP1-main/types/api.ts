// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth API responses
export interface AuthResponse {
  message: string;
  token: string;
  user: {
    user_id: string;
    email: string;
    full_name: string;
    username: string;
    bio?: string;
    user_type: 'user' | 'expert';
    area_of_expertise?: string;
    profile_picture?: string;
    created_at: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  username: string;
  bio?: string;
  userType?: 'user' | 'expert';
  areaOfExpertise?: string;
  profilePicture?: string;
}

// Users API responses
export interface UsersResponse {
  experts: Array<{
    user_id: string;
    email: string;
    full_name: string;
    username: string;
    bio?: string;
    user_type: 'expert';
    area_of_expertise?: string;
    profile_picture?: string;
    created_at: string;
  }>;
}

// Challenges API responses
export interface ChallengesResponse {
  challenges: Array<{
    challenge_id: string;
    expert_id: string;
    title: string;
    description: string;
    created_at: string;
    expert?: {
      full_name: string;
      username: string;
      area_of_expertise?: string;
    };
  }>;
}

export interface ChallengeResponse {
  challenge: {
    challenge_id: string;
    expert_id: string;
    title: string;
    description: string;
    created_at: string;
    expert?: {
      full_name: string;
      username: string;
      area_of_expertise?: string;
    };
  };
}

export interface SolutionsResponse {
  solutions: Array<{
    solution_id: string;
    challenge_id: string;
    expert_id: string;
    content: string;
    created_at: string;
    expert?: {
      full_name: string;
      username: string;
    };
  }>;
}

// Questions API responses
export interface QuestionsResponse {
  questions: Array<{
    question_id: string;
    content: string;
    created_at: string;
  }>;
}

export interface QuestionResponse {
  question: {
    question_id: string;
    content: string;
    created_at: string;
  };
}

// Answers API responses
export interface AnswersResponse {
  answers: Array<{
    answer_id: string;
    question_id: string;
    expert_id: string;
    content: string;
    created_at: string;
    expert?: {
      full_name: string;
      username: string;
      area_of_expertise?: string;
    };
  }>;
}

export interface AnswerResponse {
  answer: {
    answer_id: string;
    question_id: string;
    expert_id: string;
    content: string;
    created_at: string;
    expert?: {
      full_name: string;
      username: string;
      area_of_expertise?: string;
    };
  };
}

// Error response type
export interface ErrorResponse {
  error: string;
  details?: any;
}
