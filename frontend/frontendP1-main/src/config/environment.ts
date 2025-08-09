export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://192.168.188.156:3000/api'  // Development - backend server IP
    : 'https://production-api.com/api',   // Production - replace with real URL
  TIMEOUT: 10000,
};