import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../../config/api';
import { AuthStackParamList } from '../../../App';

// Define navigation types
type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [userType, setUserType] = useState<'student' | 'expert' | 'admin'>('student');
  const [bio, setBio] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleSignup = async (): Promise<void> => {
    console.log('🎯 Signup button clicked!');
    console.log('📧 Email:', email);
    console.log('👤 Full Name:', fullName);
    console.log('🆔 Username:', username);
    console.log('👥 User Type:', userType);

    // Input validation
    if (!email?.trim() || !fullName?.trim() || !username?.trim() || !password?.trim() || !confirmPassword?.trim()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    // Bio validation for experts
    if (userType === 'expert' && !bio?.trim()) {
      Alert.alert('Validation Error', 'Bio is required for expert accounts');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 Making signup API call...');
      
      const userData = {
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        username: username.trim(),
        userType,
        bio: bio?.trim() || null
      };

      console.log('📤 Sending data to server:', { ...userData, password: '[HIDDEN]' });

      const response = await api.post('/auth/register', userData);
      
      console.log('✅ Registration successful:', response.data);

      Alert.alert(
        'Registration Successful', 
        `Welcome to ExpertSolve Hub! Your ${userType} account has been created.`,
        [
          {
            text: 'Login Now',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );

    } catch (error: any) {
      console.error('❌ Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.request ? 'Request made but no response' : 'No request made'
      });

      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        const serverMessage = error.response.data?.message || 
                             error.response.data?.error || 
                             error.response.data?.msg;
        
        switch (error.response.status) {
          case 400:
            errorMessage = serverMessage || 'Invalid input data';
            break;
          case 409:
            errorMessage = 'Email or username already exists';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = serverMessage || `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred';
      }

      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = (): void => {
    navigation.navigate('Login');
  };

  const getUserTypeDescription = (type: string) => {
    switch (type) {
      case 'student':
        return 'Students can ask questions, participate in challenges, and learn from experts';
      case 'expert':
        return 'Experts can answer questions, create challenges, and mentor students';
      case 'admin':
        return 'Administrators can manage users, moderate content, and oversee the platform';
      default:
        return '';
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join ExpertSolve Hub</Text>
          
          {/* User Type Selection */}
          <View style={styles.userTypeContainer}>
            <Text style={styles.label}>Account Type *</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[styles.pickerButton, userType === 'student' && styles.selectedPicker]}
                onPress={() => setUserType('student')}
                disabled={isLoading}
              >
                <Text style={[styles.pickerText, userType === 'student' && styles.selectedPickerText]}>
                  Student
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerButton, userType === 'expert' && styles.selectedPicker]}
                onPress={() => setUserType('expert')}
                disabled={isLoading}
              >
                <Text style={[styles.pickerText, userType === 'expert' && styles.selectedPickerText]}>
                  Expert
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerButton, userType === 'admin' && styles.selectedPicker]}
                onPress={() => setUserType('admin')}
                disabled={isLoading}
              >
                <Text style={[styles.pickerText, userType === 'admin' && styles.selectedPickerText]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.userTypeDescription}>
              {getUserTypeDescription(userType)}
            </Text>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor="#999"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            returnKeyType="next"
            textContentType="emailAddress"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor="#999"
            onChangeText={setFullName}
            value={fullName}
            autoCapitalize="words"
            editable={!isLoading}
            returnKeyType="next"
            textContentType="name"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Username *"
            placeholderTextColor="#999"
            onChangeText={setUsername}
            value={username}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            returnKeyType="next"
            textContentType="username"
          />

          {/* Bio field - required for experts */}
          {userType === 'expert' && (
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Bio (Tell us about your expertise) *"
              placeholderTextColor="#999"
              onChangeText={setBio}
              value={bio}
              multiline={true}
              numberOfLines={3}
              editable={!isLoading}
              returnKeyType="next"
            />
          )}

          {/* Regular bio for others (optional) */}
          {userType !== 'expert' && (
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Bio (Optional)"
              placeholderTextColor="#999"
              onChangeText={setBio}
              value={bio}
              multiline={true}
              numberOfLines={2}
              editable={!isLoading}
              returnKeyType="next"
            />
          )}
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password *"
              placeholderTextColor="#999"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!showPassword}
              editable={!isLoading}
              returnKeyType="next"
              textContentType="newPassword"
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password *"
              placeholderTextColor="#999"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
              returnKeyType="done"
              textContentType="newPassword"
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
              disabled={isLoading}
            >
              <Icon name={showConfirmPassword ? 'eye' : 'eye-slash'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.signupButton, isLoading && styles.disabledButton]} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin} disabled={isLoading}>
              <Text style={[styles.loginLink, isLoading && styles.disabledText]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  userTypeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    alignItems: 'center',
  },
  selectedPicker: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  pickerText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedPickerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userTypeDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingRight: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#B0B0B0',
  },
});

export default SignupScreen;
