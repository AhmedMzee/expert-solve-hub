import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../App';
import axios from 'axios';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('http://10.0.2.2:8080/api/auth/forgot-password', {
        email
      });

      Alert.alert('Success', 'Password reset link sent to your email');
      navigation.navigate('Login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data.message || 'Failed to send reset link');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a password reset link</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#95a5a6"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.backLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.backLinkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#f8f9fa' // Light gray background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50', // Dark blue-gray
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d', // Gray
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    backgroundColor: '#ffffff', // White
    color: '#2c3e50', // Dark text
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Light border
    fontSize: 16
  },
  button: {
    backgroundColor: '#3498db', // Blue
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20
  },
  buttonText: {
    color: '#ffffff', // White
    fontWeight: '600',
    fontSize: 16
  },
  backLink: {
    alignSelf: 'center'
  },
  backLinkText: {
    color: '#3498db', // Blue
    fontWeight: '500',
    fontSize: 14
  }
});

export default ForgotPasswordScreen;