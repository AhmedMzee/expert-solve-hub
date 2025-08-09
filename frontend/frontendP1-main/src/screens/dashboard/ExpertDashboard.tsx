import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';
import { useUser } from '../../context/UserContext';

const ExpertDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout } = useUser();
  const [stats, setStats] = useState({
    questionsAnswered: 0,
    challengesCreated: 0,
    studentsHelped: 0,
    reputation: 0,
    pendingQuestions: 0,
  });

  useEffect(() => {
    loadExpertStats();
  }, []);

  const loadExpertStats = async () => {
    try {
      // TODO: Implement API calls to get expert statistics
      // const statsData = await expertService.getMyStatistics();
      // setStats(statsData);
      
      // Mock data for now
      setStats({
        questionsAnswered: 45,
        challengesCreated: 8,
        studentsHelped: 23,
        reputation: 1250,
        pendingQuestions: 3,
      });
    } catch (error) {
      console.error('Failed to load expert stats:', error);
    }
  };

  const expertActions = [
    {
      title: 'Answer Questions',
      subtitle: `${stats.pendingQuestions} new questions`,
      icon: 'help-circle',
      color: '#4CAF50',
      onPress: () => Alert.alert('Coming Soon', 'Questions feature'),
    },
    {
      title: 'Create Challenge',
      subtitle: 'Design new challenges',
      icon: 'trophy',
      color: '#FF9800',
      onPress: () => Alert.alert('Coming Soon', 'Challenge creation feature'),
    },
    {
      title: 'My Content',
      subtitle: 'Manage your contributions',
      icon: 'document-text',
      color: '#2196F3',
      onPress: () => Alert.alert('Coming Soon', 'Content management'),
    },
    {
      title: 'Mentoring',
      subtitle: 'Active mentorship sessions',
      icon: 'people',
      color: '#9C27B0',
      onPress: () => Alert.alert('Coming Soon', 'Mentoring dashboard'),
    },
    {
      title: 'Analytics',
      subtitle: 'View your impact',
      icon: 'bar-chart',
      color: '#607D8B',
      onPress: () => Alert.alert('Coming Soon', 'Expert analytics'),
    },
    {
      title: 'Expertise Areas',
      subtitle: 'Manage your skills',
      icon: 'school',
      color: '#795548',
      onPress: () => Alert.alert('Coming Soon', 'Expertise management'),
    },
  ];

  const recentActivity = [
    { type: 'question', title: 'How to implement Redux in React Native?', time: '2 hours ago' },
    { type: 'challenge', title: 'JavaScript Fundamentals Challenge', time: '1 day ago' },
    { type: 'question', title: 'Best practices for API integration', time: '2 days ago' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="user-graduate" size={24} color="white" />
        <Text style={styles.headerTitle}>Expert Dashboard</Text>
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
          <Text style={styles.roleText}>Expert Mentor</Text>
          <View style={styles.reputationBadge}>
            <FontAwesome5 name="star" size={16} color="#FFD700" />
            <Text style={styles.reputationText}>{stats.reputation} Reputation</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.questionsAnswered}</Text>
              <Text style={styles.statLabel}>Questions Answered</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.challengesCreated}</Text>
              <Text style={styles.statLabel}>Challenges Created</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.studentsHelped}</Text>
              <Text style={styles.statLabel}>Students Helped</Text>
            </View>
            <View style={[styles.statCard, stats.pendingQuestions > 0 && styles.highlightCard]}>
              <Text style={[styles.statNumber, stats.pendingQuestions > 0 && styles.highlightText]}>
                {stats.pendingQuestions}
              </Text>
              <Text style={[styles.statLabel, stats.pendingQuestions > 0 && styles.highlightText]}>
                Pending Questions
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Expert Actions</Text>
          <View style={styles.actionsGrid}>
            {expertActions.map((action, index) => (
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

        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons 
                  name={activity.type === 'question' ? 'help-circle' : 'trophy'} 
                  size={20} 
                  color={activity.type === 'question' ? '#4CAF50' : '#FF9800'} 
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => Alert.alert('Coming Soon', 'Answer questions feature')}
          >
            <Ionicons name="help-circle" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Answer New Questions</Text>
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
    backgroundColor: '#1565C0',
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
    color: '#1565C0',
    fontWeight: '600',
    marginBottom: 10,
  },
  reputationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reputationText: {
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
    backgroundColor: '#e3f2fd',
    borderColor: '#1565C0',
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
    color: '#1565C0',
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
  quickActions: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#1565C0',
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

export default ExpertDashboard;
