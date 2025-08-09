import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';
import { useUser } from '../../context/UserContext';

const StudentDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout } = useUser();
  const [stats, setStats] = useState({
    questionsAsked: 0,
    challengesCompleted: 0,
    expertsConnected: 0,
    learningStreak: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    loadStudentStats();
  }, []);

  const loadStudentStats = async () => {
    try {
      // TODO: Implement API calls to get student statistics
      // const statsData = await studentService.getMyStatistics();
      // setStats(statsData);
      
      // Mock data for now
      setStats({
        questionsAsked: 12,
        challengesCompleted: 5,
        expertsConnected: 8,
        learningStreak: 7,
        totalPoints: 245,
      });
    } catch (error) {
      console.error('Failed to load student stats:', error);
    }
  };

  const studentActions = [
    {
      title: 'Ask Question',
      subtitle: 'Get help from experts',
      icon: 'help-circle',
      color: '#4CAF50',
      onPress: () => Alert.alert('Coming Soon', 'Question asking feature'),
    },
    {
      title: 'Browse Questions',
      subtitle: 'Learn from others',
      icon: 'search',
      color: '#2196F3',
      onPress: () => Alert.alert('Coming Soon', 'Browse questions feature'),
    },
    {
      title: 'Take Challenges',
      subtitle: 'Test your skills',
      icon: 'trophy',
      color: '#FF9800',
      onPress: () => Alert.alert('Coming Soon', 'Challenges feature'),
    },
    {
      title: 'Find Experts',
      subtitle: 'Connect with mentors',
      icon: 'people',
      color: '#9C27B0',
      onPress: () => Alert.alert('Coming Soon', 'Expert directory'),
    },
    {
      title: 'My Progress',
      subtitle: 'Track your learning',
      icon: 'trending-up',
      color: '#607D8B',
      onPress: () => Alert.alert('Coming Soon', 'Progress tracking'),
    },
    {
      title: 'Study Groups',
      subtitle: 'Join peer learning',
      icon: 'people-circle',
      color: '#795548',
      onPress: () => Alert.alert('Coming Soon', 'Study groups'),
    },
  ];

  const recentActivity = [
    { type: 'question', title: 'Asked about React Native navigation', time: '2 hours ago', answered: true },
    { type: 'challenge', title: 'Completed JavaScript Basics', time: '1 day ago', score: 85 },
    { type: 'answer', title: 'Received answer from Dr. Smith', time: '2 days ago', helpful: true },
  ];

  const recommendedChallenges = [
    { title: 'React Fundamentals', difficulty: 'Beginner', points: 50 },
    { title: 'API Integration', difficulty: 'Intermediate', points: 75 },
    { title: 'State Management', difficulty: 'Advanced', points: 100 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="graduation-cap" size={24} color="white" />
        <Text style={styles.headerTitle}>Student Dashboard</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => Alert.alert('Coming Soon', 'Notifications')}
            style={styles.headerButton}
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={async () => {
              Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await logout();
                        // Navigation will happen automatically via UserContext
                        // The RootNavigator will switch to AuthNavigator when user is null
                      } catch (error) {
                        Alert.alert('Error', 'Failed to logout. Please try again.');
                      }
                    },
                  },
                ]
              );
            }}
            style={styles.headerButton}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome back, {user?.full_name}!</Text>
          <Text style={styles.roleText}>Student Learner</Text>
          <View style={styles.streakBadge}>
            <FontAwesome5 name="fire" size={16} color="#FF6B35" />
            <Text style={styles.streakText}>{stats.learningStreak} day streak!</Text>
          </View>
          <View style={styles.pointsBadge}>
            <MaterialCommunityIcons name="star-circle" size={16} color="#FFD700" />
            <Text style={styles.pointsText}>{stats.totalPoints} points</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Learning Journey</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.questionsAsked}</Text>
              <Text style={styles.statLabel}>Questions Asked</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.challengesCompleted}</Text>
              <Text style={styles.statLabel}>Challenges Done</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.expertsConnected}</Text>
              <Text style={styles.statLabel}>Experts Met</Text>
            </View>
            <View style={[styles.statCard, styles.highlightCard]}>
              <Text style={[styles.statNumber, styles.highlightText]}>
                {stats.learningStreak}
              </Text>
              <Text style={[styles.statLabel, styles.highlightText]}>
                Day Streak
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {studentActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.challengesContainer}>
          <Text style={styles.sectionTitle}>Recommended Challenges</Text>
          {recommendedChallenges.map((challenge, index) => (
            <TouchableOpacity key={index} style={styles.challengeCard}>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDifficulty}>{challenge.difficulty}</Text>
              </View>
              <View style={styles.challengePoints}>
                <Text style={styles.pointsValue}>{challenge.points} pts</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons 
                  name={
                    activity.type === 'question' ? 'help-circle' : 
                    activity.type === 'challenge' ? 'trophy' : 'checkmark-circle'
                  } 
                  size={20} 
                  color={
                    activity.type === 'question' ? '#4CAF50' : 
                    activity.type === 'challenge' ? '#FF9800' : '#2196F3'
                  } 
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              {activity.type === 'challenge' && activity.score && (
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{activity.score}%</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => Alert.alert('Coming Soon', 'Ask a question feature')}
          >
            <Ionicons name="help-circle" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Ask Your First Question</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  roleText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  streakText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginLeft: 5,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: 5,
  },
  statsContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightCard: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  highlightText: {
    color: '#4CAF50',
  },
  actionsContainer: {
    marginBottom: 25,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  challengesContainer: {
    marginBottom: 25,
  },
  challengeCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  challengeDifficulty: {
    fontSize: 14,
    color: '#666',
  },
  challengePoints: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pointsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  activityContainer: {
    marginBottom: 25,
  },
  activityItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  scoreBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  quickActions: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default StudentDashboard;
