// App-wide constants
export const APP_CONFIG = {
  NAME: 'ExpertSolve Hub',
  VERSION: '1.0.0',
  MIN_PASSWORD_LENGTH: 6,
  MAX_BIO_LENGTH: 500,
  MAX_QUESTION_LENGTH: 300,
  MAX_CHALLENGE_LENGTH: 1000,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME_PREFERENCE: 'themePreference',
  LANGUAGE_PREFERENCE: 'languagePreference',
} as const;

export const USER_TYPES = {
  STUDENT: 'student',
  USER: 'user',
  EXPERT: 'expert',
  ADMIN: 'admin',
} as const;

export const NAVIGATION_ROUTES = {
  // Auth
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Dashboard
  DASHBOARD: 'DashboardScreen',
  WELCOME: 'WelcomeScreen',
  
  // Profile
  PROFILE: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  CHANGE_PASSWORD: 'ChangePassword',
  
  // Features
  CHALLENGES: 'Challenges',
  SOLUTIONS: 'Solutions',
  QUESTIONS: 'Questions',
  ANSWER: 'Answer',
  
  // Settings
  SETTINGS: 'Settings',
  PRIVACY: 'PrivacySettings',
  CONTACT: 'ContactUs',
  
  // Navigation
  MENU: 'Menu',
} as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  
  // Users
  EXPERTS: '/users/experts',
  USER_BY_ID: '/users',
  UPDATE_PROFILE: '/users/profile',
  
  // Challenges
  CHALLENGES: '/challenges',
  CHALLENGE_BY_ID: '/challenges',
  CHALLENGES_BY_EXPERT: '/challenges/expert',
  CHALLENGE_SOLUTIONS: '/challenges/:id/solutions',
  
  // Questions
  QUESTIONS: '/questions',
  MY_QUESTIONS: '/questions/user/my-questions',
  
  // Answers
  ANSWERS_BY_QUESTION: '/answers/question',
  ANSWERS_BY_EXPERT: '/answers/expert',
  MY_ANSWERS: '/answers/user/my-answers',
} as const;
