import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { NavigationProp } from '@react-navigation/native';

// For Android emulator use 'http://10.0.2.2:8080'
// For physical device use your computer's local IP
const API_BASE_URL = 'http://192.168.1.106:8080';

interface Challenge {
  id: number;
  title: string;
  description: string;
  author?: string;
  createdAt: string;
  participants: number;
  daysLeft: number;
}

interface ChallengesScreenProps {
  navigation: NavigationProp<any>;
}

const Challenges: React.FC<ChallengesScreenProps> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: ''
  });
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [userProfile] = useState({
    name: 'Current User', // Replace with actual user data
    initial: 'CU'
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/challenges`);
      
      const processedChallenges = response.data.map((challenge: any) => ({
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        author: challenge.author || userProfile.name,
        createdAt: challenge.createdAt,
        participants: challenge.participants || 0,
        daysLeft: calculateDaysLeft(challenge.createdAt)
      }));
      
      setChallenges(processedChallenges);
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const endDate = new Date(createdDate);
    endDate.setDate(endDate.getDate() + 30);
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  };

  const handlePostChallenge = async () => {
    if (!newChallenge.title.trim() || !newChallenge.description.trim()) {
      Alert.alert('Error', 'Please fill in both title and description');
      return;
    }

    try {
      setPosting(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/challenges`,
        {
          title: newChallenge.title,
          description: newChallenge.description
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // Immediately update the UI with the new challenge
      const addedChallenge: Challenge = {
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        author: userProfile.name,
        createdAt: response.data.createdAt || new Date().toISOString(),
        participants: 0,
        daysLeft: 30
      };

      setChallenges(prev => [addedChallenge, ...prev]);
      setNewChallenge({ title: '', description: '' });
      setModalVisible(false);
    } catch (error) {
      console.error("Creation Error:", error);
      Alert.alert('Error', 'Failed to create challenge');
    } finally {
      setPosting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Challenges</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Challenges List */}
      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#3498db" />
        ) : challenges.length === 0 ? (
          <Text style={styles.noChallengesText}>No challenges yet</Text>
        ) : (
          challenges.map(challenge => (
            <View key={challenge.id} style={styles.challengeCard}>
              <View style={styles.profileRow}>
                <View style={styles.profileImage}>
                  <Text style={styles.profileInitial}>
                    {challenge.author?.charAt(0)?.toUpperCase() || userProfile.initial}
                  </Text>
                </View>
                <View>
                  <Text style={styles.authorName}>{challenge.author}</Text>
                  <Text style={styles.createdAt}>
                    {new Date(challenge.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDesc}>{challenge.description}</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <FontAwesome5 name="users" size={16} color="#7f8c8d" />
                  <Text style={styles.statsText}>
                    {challenge.participants} participants
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color="#7f8c8d" />
                  <Text style={styles.statsText}>
                    {challenge.daysLeft} day{challenge.daysLeft !== 1 ? 's' : ''} left
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Challenge Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>New Challenge</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newChallenge.title}
              onChangeText={text => setNewChallenge({...newChallenge, title: text})}
            />
            
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Description"
              multiline
              value={newChallenge.description}
              onChangeText={text => setNewChallenge({...newChallenge, description: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.postButton}
                onPress={handlePostChallenge}
                disabled={posting}
              >
                {posting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.postButtonText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#3498db'
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    padding: 10
  },
  noChallengesText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#7f8c8d'
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#bdc3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  profileInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  authorName: {
    fontWeight: '600',
    color: '#2c3e50'
  },
  createdAt: {
    color: '#7f8c8d',
    fontSize: 12
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#2c3e50'
  },
  challengeDesc: {
    color: '#34495e',
    marginBottom: 10
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statsText: {
    marginLeft: 5,
    color: '#7f8c8d'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#333'
  },
  postButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    flex: 1
  },
  postButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  }
});

export default Challenges;