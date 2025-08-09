import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuestionsScreen: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handlePostQuestion = () => {
    // Handle posting the question (you would implement your actual logic here)
    console.log('Posting question:', question);
    console.log('Anonymous:', isAnonymous);
    // Reset form after posting
    setQuestion('');
    setIsAnonymous(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ask & Answer Questions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Users can post anonymous questions.</Text>

        {/* Question Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="What's your question?"
            placeholderTextColor="#aaa"
            multiline
            value={question}
            onChangeText={setQuestion}
          />
          <View style={styles.characterCount}>
            <Text style={styles.characterCountText}>{question.length}/300</Text>
          </View>
        </View>

        {/* Anonymous Toggle */}
        <TouchableOpacity 
          style={styles.anonymousOption} 
          onPress={() => setIsAnonymous(!isAnonymous)}
        >
          <View style={styles.checkbox}>
            {isAnonymous && <Ionicons name="checkmark" size={16} color="#f8b400" />}
          </View>
          <Text style={styles.anonymousText}>Post anonymously</Text>
        </TouchableOpacity>

        {/* Post Button */}
        <TouchableOpacity 
          style={[styles.postButton, !question && styles.disabledButton]} 
          onPress={handlePostQuestion}
          disabled={!question}
        >
          <Text style={styles.postButtonText}>Post Question</Text>
        </TouchableOpacity>

        {/* Recent Questions Section */}
        <Text style={styles.sectionTitle}>Recent Questions</Text>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>How do I implement dark mode in React Native?</Text>
          <Text style={styles.questionMeta}>Posted anonymously • 2 hours ago</Text>
        </View>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>What are the best practices for React Native navigation?</Text>
          <Text style={styles.questionMeta}>Posted by @dev_user • 5 hours ago</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    color: 'white',
    fontSize: 16,
    padding: 15,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    padding: 10,
    alignItems: 'flex-end',
  },
  characterCountText: {
    color: '#666',
    fontSize: 12,
  },
  anonymousOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#f8b400',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anonymousText: {
    color: 'white',
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#f8b400',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  postButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  questionCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  questionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  questionMeta: {
    color: '#aaa',
    fontSize: 12,
  },
});

export default QuestionsScreen;