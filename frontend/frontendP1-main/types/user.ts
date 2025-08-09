// User related types
export interface User {
  user_id: string;
  email: string;
  full_name: string;
  username: string;
  bio?: string;
  user_type: 'user' | 'expert';
  area_of_expertise?: string;
  profile_picture?: string;
  created_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  username: string;
  bio?: string;
  userType?: 'user' | 'expert';
  areaOfExpertise?: string;
  profilePicture?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  username?: string;
  bio?: string;
  areaOfExpertise?: string;
  profilePicture?: string;
}

// Challenge related types
export interface Challenge {
  challenge_id: string;
  expert_id: string;
  title: string;
  description: string;
  created_at: string;
  expert?: User;
  solutions_count?: number;
  participants_count?: number;
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
}

export interface Solution {
  solution_id: string;
  challenge_id: string;
  expert_id: string;
  content: string;
  created_at: string;
  expert?: User;
}

export interface CreateSolutionRequest {
  content: string;
}

// Question related types
export interface Question {
  question_id: string;
  user_id: string;
  content: string;
  created_at: string;
  answers_count?: number;
}

export interface CreateQuestionRequest {
  content: string;
}

// Answer related types
export interface Answer {
  answer_id: string;
  question_id: string;
  expert_id: string;
  content: string;
  created_at: string;
  expert?: User;
  question?: Question;
}

export interface CreateAnswerRequest {
  content: string;
}
