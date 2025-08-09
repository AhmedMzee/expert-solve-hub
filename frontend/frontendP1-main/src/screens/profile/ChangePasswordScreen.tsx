import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import Menu from '../../components/navigation/Menu';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [email, setEmail] = useState('swalihinamachano@gmail.com');
  const [captchaSolved, setCaptchaSolved] = useState(false);

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Password update request:', { oldPassword, newPassword });
  };

  const handleForgotPassword = () => {
    setResetModalVisible(true);
  };

  const handleSendResetEmail = () => {
    if (!captchaSolved) {
      alert("Please complete the verification puzzle");
      return;
    }
    console.log('Sending reset email to:', email);
    setResetModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Old password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              placeholderTextColor="#95a5a6"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#95a5a6"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm new password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#95a5a6"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.passwordHint}>
            Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter.{' '}
            <Text 
              style={styles.link} 
              onPress={() => Linking.openURL('https://yourwebsite.com/password-requirements')}
            >
              Learn more.
            </Text>
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleUpdatePassword}
            >
              <Text style={styles.buttonText}>Update password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.secondaryButton}>I forgot my password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Password Reset Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={resetModalVisible}
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset your password</Text>
            
            <Text style={styles.modalText}>
              Enter your user account's verified email address and we will send you a password reset link.
            </Text>
            
            <TextInput
              style={styles.emailInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#95a5a6"
            />
            
            <Text style={styles.verifyText}>Verify your account</Text>
            <Text style={styles.puzzleText}>
              Please solve this puzzle so we know you are a real person
            </Text>
            
            <View style={styles.captchaPlaceholder}>
              <Text style={{color: '#7f8c8d'}}>[CAPTCHA PUZZLE HERE]</Text>
              <TouchableOpacity 
                style={styles.verifyButton}
                onPress={() => setCaptchaSolved(true)}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.audioButton}>
                <Text style={styles.audioButtonText}>Audio</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendResetEmail}
            >
              <Text style={styles.sendButtonText}>Send password reset email</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setResetModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#7f8c8d" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* <Menu navigation={navigation} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
  passwordHint: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 20,
  },
  link: {
    color: '#3498db',
  },
  buttonRow: {
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    padding: 12,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c3e50',
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#7f8c8d',
  },
  emailInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    color: '#2c3e50',
  },
  verifyText: {
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start',
    color: '#2c3e50',
  },
  puzzleText: {
    color: '#7f8c8d',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  captchaPlaceholder: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  verifyButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  audioButton: {
    marginTop: 10,
  },
  audioButtonText: {
    color: '#3498db',
  },
  sendButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default ChangePasswordScreen;