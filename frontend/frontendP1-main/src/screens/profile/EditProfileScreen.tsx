import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import Menu from '../../components/navigation/Menu';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [showTime, setShowTime] = useState(false);
  const [website, setWebsite] = useState('');
  const [socialLinks, setSocialLinks] = useState(['', '', '', '']);

  const handleSocialChange = (value: string, index: number) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };

  const handleSave = () => {
    console.log({
      name,
      bio,
      pronouns,
      company,
      location,
      showTime,
      website,
      socialLinks,
    });
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Profile Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#8b8b8b"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself"
            placeholderTextColor="#8b8b8b"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
        </View>


        <View style={styles.switchGroup}>
          <Text style={styles.label}>Display current local time</Text>
          <Switch
            value={showTime}
            onValueChange={setShowTime}
            trackColor={{ false: '#333', true: '#4CAF50' }}
            thumbColor={showTime ? '#fff' : '#f5f5f5'}
            ios_backgroundColor="#333"
          />
        </View>


        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Menu component at the bottom */}
      <Menu navigation={navigation} />
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light gray background
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80, // Extra padding to account for the Menu
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50', // Dark blue-gray text
    marginTop: 20,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Light border
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d', // Gray text
  },
  input: {
    backgroundColor: '#ffffff', // White input background
    borderWidth: 1,
    borderColor: '#e0e0e0', // Light border
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    color: '#2c3e50', // Dark text
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Light border
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0', // Light gray
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#3498db', // Blue button
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#2c3e50', // Dark text
    fontWeight: '600',
    fontSize: 15,
  },
  saveButtonText: {
    color: '#ffffff', // White text
    fontWeight: '600',
    fontSize: 15,
  },
});

export default EditProfileScreen;