// Input validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username: string): {
  isValid: boolean;
  error?: string;
} => {
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be less than 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { isValid: true };
};

export const validateFullName = (fullName: string): {
  isValid: boolean;
  error?: string;
} => {
  if (fullName.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters long' };
  }
  
  if (fullName.trim().length > 50) {
    return { isValid: false, error: 'Full name must be less than 50 characters' };
  }
  
  return { isValid: true };
};

export const validateBio = (bio: string): {
  isValid: boolean;
  error?: string;
} => {
  if (bio.length > 500) {
    return { isValid: false, error: 'Bio must be less than 500 characters' };
  }
  
  return { isValid: true };
};

export const validateQuestionContent = (content: string): {
  isValid: boolean;
  error?: string;
} => {
  if (content.trim().length < 10) {
    return { isValid: false, error: 'Question must be at least 10 characters long' };
  }
  
  if (content.length > 300) {
    return { isValid: false, error: 'Question must be less than 300 characters' };
  }
  
  return { isValid: true };
};

export const validateChallengeContent = (content: string): {
  isValid: boolean;
  error?: string;
} => {
  if (content.trim().length < 20) {
    return { isValid: false, error: 'Challenge description must be at least 20 characters long' };
  }
  
  if (content.length > 1000) {
    return { isValid: false, error: 'Challenge description must be less than 1000 characters' };
  }
  
  return { isValid: true };
};
