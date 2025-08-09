import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Question {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
}

const questionsSample: Question[] = [
  {
    id: '1',
    title: 'Explain the concept of closures in JavaScript.',
    topic: 'JavaScript',
    difficulty: 'Medium',
  },
  {
    id: '2',
    title: 'What is a pure function?',
    topic: 'Functional Programming',
    difficulty: 'Easy',
  },
];

const Answer = () => {
  const [activeTab, setActiveTab] = useState<'Unanswered' | 'Answered'>('Unanswered');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>('');

  const openAnswerModal = (question: Question) => {
    setSelectedQuestion(question);
    setModalVisible(true);
  };

  const submitAnswer = () => {
    console.log('Answer submitted:', answer);
    setModalVisible(false);
    setAnswer('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Interview Practice</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabMenu}>
        {['Unanswered', 'Answered'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as 'Unanswered' | 'Answered')}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            {activeTab === 'Unanswered' ? 'Your Questions' : 'Answered'}
          </Text>

          <FlatList
            data={questionsSample}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.questionCard}>
                <Text style={styles.questionTitle}>{item.title}</Text>
                <Text style={styles.questionMeta}>
                  Topic: {item.topic} | Difficulty: {item.difficulty}
                </Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.answerButton}
                    onPress={() => openAnswerModal(item)}
                  >
                    <Text style={styles.answerButtonText}>Answer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.passButton}>
                    <Text style={styles.passButtonText}>Pass</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>

      {/* Answer Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Answer Question</Text>
            <Text style={styles.questionText}>{selectedQuestion?.title}</Text>
            <TextInput
              style={styles.answerInput}
              placeholder="Type your answer..."
              multiline
              value={answer}
              onChangeText={setAnswer}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setAnswer('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !answer && styles.submitButtonDisabled,
                ]}
                onPress={submitAnswer}
                disabled={!answer}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Answer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light gray background
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center', // Centered header
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff', // White header
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Light border
  },
  headerTitle: {
    color: '#2c3e50', // Dark blue-gray text
    fontSize: 20,
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
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3498db', // Bright blue active tab
  },
  tabText: {
    color: '#95a5a6', // Gray inactive tab text
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#3498db', // Blue active tab text
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 30,
    marginTop: 20,
  },
  sectionHeader: {
    color: '#2c3e50', // Dark blue-gray
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  questionCard: {
    backgroundColor: '#ffffff', // White cards
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionTitle: {
    color: '#2c3e50', // Dark text
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  questionMeta: {
    color: '#7f8c8d', // Gray meta text
    fontSize: 12,
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  answerButton: {
    backgroundColor: '#3498db', // Blue answer button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  answerButtonText: {
    color: '#ffffff', // White text
    fontWeight: 'bold',
  },
  passButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bdc3c7', // Light gray border
  },
  passButtonText: {
    color: '#7f8c8d', // Gray text
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
    width: width * 0.9,
    maxWidth: 400,
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
    color: '#2c3e50', // Dark text
    marginBottom: 15,
    textAlign: 'center',
  },
  questionText: {
    color: '#2c3e50', // Dark text
    fontSize: 16,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f9fa', // Light gray background
    borderRadius: 8,
  },
  answerInput: {
    backgroundColor: '#f8f9fa', // Light gray input
    borderRadius: 8,
    padding: 15,
    color: '#2c3e50', // Dark text
    fontSize: 16,
    textAlignVertical: 'top',
    height: 200,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  submitButton: {
    backgroundColor: '#3498db', // Blue submit button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff', // White text
    fontWeight: 'bold',
  },
});
