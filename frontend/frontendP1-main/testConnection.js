// Quick test file to verify API connection
import { API_CONFIG } from './src/config/environment';

const testConnection = async () => {
  try {
    console.log('🧪 Testing API connection...');
    console.log('📡 API Base URL:', API_CONFIG.BASE_URL);
    
    const response = await fetch(API_CONFIG.BASE_URL.replace('/api', ''));
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Backend connection successful!');
      console.log('📝 Response:', data);
    } else {
      console.log('❌ Backend connection failed with status:', response.status);
    }
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
};

// Test the connection
testConnection();
