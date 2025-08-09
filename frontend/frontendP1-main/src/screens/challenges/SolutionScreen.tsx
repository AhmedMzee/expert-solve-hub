import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

const SolutionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'solutions' | 'drafts'>('solutions');
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentSolution, setCurrentSolution] = useState<{
    id?: number;
    title: string;
    content: string;
  } | null>(null);

  const solutions = [
    {
      id: 1,
      title: 'How to implement dark mode in React Native?',
      answers: 8,
      lastFollowed: 'Jul 15',
    },
    {
      id: 2,
      title: 'Best practices for state management in 2023',
      answers: 12,
      lastFollowed: 'May 20',
    },
  ];

  const drafts = [
    {
      id: 1,
      title: 'Draft solution about React Native performance',
      content: 'Some saved content...',
      lastEdited: '3 days ago',
    },
    {
      id: 2,
      title: 'Unfinished response to navigation question',
      content: 'Unfinished content...',
      lastEdited: '5 days ago',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#f8b400" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solutions</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tab Menu */}
      <View style={styles.tabMenu}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'solutions' && styles.activeTab]}
          onPress={() => setActiveTab('solutions')}
        >
          <Text style={[styles.tabText, activeTab === 'solutions' && styles.activeTabText]}>
            Solutions for you
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'drafts' && styles.activeTab]}
          onPress={() => setActiveTab('drafts')}
        >
          <Text style={[styles.tabText, activeTab === 'drafts' && styles.activeTabText]}>
            Drafts
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'solutions' ? (
          <>
            <Text style={styles.sectionSubheader}>Solution requests</Text>
            {solutions.map((solution) => (
              <View key={solution.id} style={styles.questionCard}>
                <Text style={styles.questionTitle}>{solution.title}</Text>
                <Text style={styles.questionMeta}>
                  {solution.answers} solutions • Last followed {solution.lastFollowed}
                </Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.answerButton}
                    onPress={() => {
                      setCurrentSolution({
                        id: solution.id,
                        title: solution.title,
                        content: '',
                      });
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.answerButtonText}>Provide Solution</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.passButton}>
                    <Text style={styles.passButtonText}>Pass</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.sectionSubheader}>Your unfinished solutions</Text>
            {drafts.map((draft) => (
              <View key={draft.id} style={styles.questionCard}>
                <Text style={styles.questionTitle}>{draft.title}</Text>
                <Text style={styles.questionMeta}>Last edited {draft.lastEdited}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => {
                      setCurrentSolution({
                        id: draft.id,
                        title: draft.title,
                        content: draft.content,
                      });
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.continueButtonText}>Continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Topics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Add 5 topics you know about</Text>
          <Text style={styles.sectionSubheader}>
            You'll get better solutions if you add more specific topics.
          </Text>
          <TouchableOpacity style={styles.addTopicsButton}>
            <Text style={styles.addTopicsButtonText}>Add topics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Provide/Continue Solution */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write Your Solution</Text>
            <Text style={styles.questionTitle}>{currentSolution?.title}</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter your solution here..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={6}
              value={currentSolution?.content}
              onChangeText={(text) =>
                setCurrentSolution((prev) => (prev ? { ...prev, content: text } : null))
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.passButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('Submitted:', currentSolution);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.continueButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light gray background
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#ffffff', // White header
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Light border
  },
  headerTitle: {
    color: '#2c3e50', // Dark blue-gray text
    fontSize: 22,
    fontWeight: 'bold',
  },
  tabMenu: {
    flexDirection: 'row',
    backgroundColor: '#ffffff', // White tab background
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3498db', // Bright blue active tab
  },
  tabText: {
    color: '#95a5a6', // Gray inactive tab text
    fontWeight: '600',
    fontSize: 15,
  },
  activeTabText: {
    color: '#3498db', // Blue active tab text
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    marginTop: 25,
  },
  sectionHeader: {
    color: '#2c3e50', // Dark blue-gray
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionSubheader: {
    color: '#7f8c8d', // Gray
    fontSize: 14,
    marginBottom: 18,
  },
  questionCard: {
    backgroundColor: '#ffffff', // White cards
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionTitle: {
    color: '#3498db', // Blue text for questions
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  questionMeta: {
    color: '#7f8c8d', // Gray
    fontSize: 13,
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  answerButton: {
    backgroundColor: '#3498db', // Blue button
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  answerButtonText: {
    color: '#ffffff', // White text
    fontWeight: '700',
    fontSize: 16,
  },
  passButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#3498db', // Blue border
  },
  passButtonText: {
    color: '#3498db', // Blue text
    fontWeight: '600',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#3498db', // Blue button
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  continueButtonText: {
    color: '#ffffff', // White text
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#e74c3c', // Red border
  },
  deleteButtonText: {
    color: '#e74c3c', // Red text
    fontWeight: '600',
    fontSize: 16,
  },
  addTopicsButton: {
    backgroundColor: '#ecf0f1', // Light gray
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  addTopicsButtonText: {
    color: '#3498db', // Blue text
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff', // White modal
    padding: 25,
    borderRadius: 20,
    width: '90%',
    minHeight: 280,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalTitle: {
    color: '#3498db', // Blue text
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  textArea: {
    height: 140,
    backgroundColor: '#f8f9fa', // Light gray background
    color: '#2c3e50', // Dark text
    borderRadius: 15,
    padding: 14,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SolutionScreen;
