import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthStackParamList } from '../../../App';
import { useUser } from '../../context/UserContext';

type LoginScreenNavigationProp = NavigationProp<AuthStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      await login({
        email: email.trim().toLowerCase(),
        password: password.trim()
      });

      // Navigation will happen automatically via UserContext
      // The RootNavigator will switch to MainNavigator when user is set

    } catch (error: any) {
      if (error.response?.status === 401) {
        setLoginError('Incorrect Login Information');
      } else {
        setLoginError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => navigation.navigate('Signup');
  const navigateToForgotPassword = () => navigation.navigate('ForgotPassword');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>ExpertSolve Hub</Text>
        <Text style={styles.subtitle}>Connect with Experts</Text>

        {loginError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{loginError}</Text>
          </View>
        ) : null}

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Icon name="envelope" size={18} color="#3498db" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Icon name="lock" size={20} color="#3498db" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        <TouchableOpacity onPress={navigateToForgotPassword} style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="white" size="small" />
              <Text style={styles.loadingText}>Signing in...</Text>
            </View>
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToSignup} style={styles.signupButton}>
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  errorBanner: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorBannerText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e1e8ed',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 16,
    paddingHorizontal: 10,
    height: 52,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    paddingVertical: 5,
  },
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 52,
    justifyContent: 'center',
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    elevation: 0,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  signupButton: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  signupTextBold: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
