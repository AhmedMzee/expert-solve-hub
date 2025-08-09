import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileBio}>Software Developer</Text>
      </View>

      {/* Profile Options */}
      <View style={styles.optionContainer}>
        <TouchableOpacity 
          style={styles.option} 
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="person-circle-outline" size={24} color="#3498db" />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.option} 
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Ionicons name="lock-closed-outline" size={24} color="#3498db" />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.option}>
          <Ionicons name="help-circle-outline" size={24} color="#3498db" />
          <Text style={styles.optionText}>Help & Support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.option, { borderBottomWidth: 0 }]}>
          <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
          <Text style={[styles.optionText, { color: '#e74c3c' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#3498db',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  profileBio: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  optionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default ProfileScreen;