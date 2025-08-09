// screens/DashboardScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';
import Menu from '../../components/navigation/Menu';
import { challengeService } from '../../services/challengeService';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmitQuestion = () => {
    const questionData = {
      title: questionTitle,
      content: questionDescription,
      anonymousQuestion: isAnonymous,
      createdAt: new Date().toISOString(),
    };

    useEffect(()=>{
      console.log("this is my access token ", localStorage.getItem('token'))
    },[])

    console.log('Submitting question:', questionData);
    setModalVisible(false);
    setQuestionTitle('');
    setQuestionDescription('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="home" size={24} color="white" />
        <Text style={styles.headerTitle}>ExpertSolve Hub</Text>
        <Ionicons name="notifications-outline" size={24} color="white" />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
          <Feather name="edit" size={20} color="white" />
          <Text style={styles.actionButtonText}>Ask</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Answer')}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Answer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-text-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginBottom: 80 }}>
        <Text style={styles.sectionTitle}>Expert Challenges & Solutions</Text>
        {/* Your feed content here */}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Ask a Question</Text>

            <Text style={styles.sectionHeader}>Question Title</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your question title"
              placeholderTextColor="#aaa"
              value={questionTitle}
              onChangeText={setQuestionTitle}
            />

            <Text style={styles.sectionHeader}>Description</Text>
            <TextInput
              style={[styles.inputField, styles.multilineInput]}
              placeholder="Describe your question in detail"
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={4}
              value={questionDescription}
              onChangeText={setQuestionDescription}
            />

            <View style={styles.privacyOptions}>
              <TouchableOpacity
                style={styles.privacyOption}
                onPress={() => setIsAnonymous(false)}
              >
                <Ionicons
                  name={isAnonymous ? 'radio-button-off' : 'radio-button-on'}
                  size={20}
                  color={isAnonymous ? '#666' : '#0095f6'}
                />
                <Text style={styles.privacyOptionText}>Public Question</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.privacyOption}
                onPress={() => setIsAnonymous(true)}
              >
                <Ionicons
                  name={isAnonymous ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isAnonymous ? '#0095f6' : '#666'}
                />
                <Text style={styles.privacyOptionText}>Ask Anonymously</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setQuestionTitle('');
                  setQuestionDescription('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.postButton,
                  (!questionTitle.trim() || !questionDescription.trim()) && styles.postButtonDisabled,
                ]}
                onPress={handleSubmitQuestion}
                disabled={!questionTitle.trim() || !questionDescription.trim()}
              >
                <Text style={styles.postButtonText}>Post Question</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Menu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light gray background
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff', // White header
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Light border
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50', // Dark blue-gray
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#ffffff', // White background for buttons
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButton: {
    backgroundColor: '#3498db', // Bright blue
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: '#ffffff', // White text
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  sectionTitle: {
    color: '#2c3e50', // Dark blue-gray
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#ffffff', // White modal
    borderRadius: 12,
    padding: 20,
    width: '90%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50', // Dark blue-gray
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    color: '#3498db', // Bright blue
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  inputField: {
    backgroundColor: '#f8f9fa', // Light gray
    borderRadius: 8,
    padding: 12,
    color: '#2c3e50', // Dark text
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  privacyOptions: {
    marginVertical: 20,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  privacyOptionText: {
    color: '#2c3e50', // Dark text
    fontSize: 16,
    marginLeft: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0', // Light gray
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2c3e50', // Dark text
    fontWeight: 'bold',
  },
  postButton: {
       backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20
  },
  postButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#95a5a6', // Gray when disabled
  },
  postButtonText: {
    color: '#ffffff', // White text
    fontWeight: 'bold',
  },
});
export default DashboardScreen;
