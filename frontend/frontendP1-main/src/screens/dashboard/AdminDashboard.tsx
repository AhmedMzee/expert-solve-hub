import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';
import { useUser } from '../../context/UserContext';

const AdminDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout } = useUser();
  const [stats, setStats] = useState({
    totalUsers: 156,
    totalExperts: 23,
    totalQuestions: 342,
    totalChallenges: 45,
    pendingReports: 5,
  });

  const handleLogout = async () => {
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="admin-panel-settings" size={24} color="white" />
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => Alert.alert('Coming Soon', 'Notifications')}
            style={styles.headerButton}
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.headerButton}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome back, {user?.full_name}!</Text>
          <Text style={styles.roleText}>Administrator</Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Platform Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalQuestions}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalChallenges}</Text>
              <Text style={styles.statLabel}>Challenges</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={[styles.statCard, stats.pendingReports > 0 && styles.alertCard]}>
              <Text style={[styles.statNumber, stats.pendingReports > 0 && styles.alertText]}>
                {stats.pendingReports}
              </Text>
              <Text style={[styles.statLabel, stats.pendingReports > 0 && styles.alertText]}>
                Reports
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Admin Actions</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Coming Soon', 'User Management')}>
            <MaterialIcons name="people" size={24} color="white" />
            <Text style={styles.actionButtonText}>User Management</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Coming Soon', 'Content Moderation')}>
            <MaterialIcons name="flag" size={24} color="white" />
            <Text style={styles.actionButtonText}>Content Moderation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Coming Soon', 'System Settings')}>
            <MaterialIcons name="settings" size={24} color="white" />
            <Text style={styles.actionButtonText}>System Settings</Text>
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
    backgroundColor: '#d32f2f',
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
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  roleText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '600',
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
  },
  alertCard: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
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
  alertText: {
    color: '#f44336',
  },
  actionsContainer: {
    marginBottom: 25,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AdminDashboard;
