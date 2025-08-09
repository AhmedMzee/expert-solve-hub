import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  RefreshControl,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { useUser } from './context/UserContext';
import { categoryService, Category, CategoryStats } from './services/categoryService';

const { width: screenWidth } = Dimensions.get('window');

const DashboardScreen = () => {
  const { user, logout, isExpert } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Load categories and stats in parallel
      const [categoriesData, statsData] = await Promise.allSettled([
        categoryService.getAll(),
        categoryService.getStats(),
      ]);

      // Handle categories result
      if (categoriesData.status === 'fulfilled') {
        setCategories(categoriesData.value);
      } else {
        console.error('Categories load failed:', categoriesData.reason);
        setError('Failed to load categories');
      }

      // Handle stats result (optional)
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      } else {
        console.warn('Stats load failed:', statsData.reason);
        // Stats failure is not critical, calculate from categories
        if (categoriesData.status === 'fulfilled') {
          const calculatedStats = calculateStatsFromCategories(categoriesData.value);
          setStats(calculatedStats);
        }
      }

    } catch (error: any) {
      console.error('Dashboard load error:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStatsFromCategories = (categories: Category[]): CategoryStats => {
    return {
      total_categories: categories.length,
      total_challenges: categories.reduce((sum, cat) => sum + (cat.challenge_count || 0), 0),
      total_questions: categories.reduce((sum, cat) => sum + (cat.question_count || 0), 0),
      total_experts: categories.reduce((sum, cat) => sum + (cat.expert_count || 0), 0),
    };
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
          {isExpert && (
            <View style={styles.expertBadge}>
              <Text style={styles.expertBadgeText}>Expert</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStats = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Platform Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total_categories}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total_challenges}</Text>
            <Text style={styles.statLabel}>Challenges</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total_questions}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total_experts}</Text>
            <Text style={styles.statLabel}>Experts</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCategory = ({ item, index }: { item: Category; index: number }) => {
    // Generate a color based on category name or use provided color
    const getCategoryColor = (categoryName: string, providedColor?: string) => {
      if (providedColor) return providedColor;
      
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
      const colorIndex = categoryName.length % colors.length;
      return colors[colorIndex];
    };

    const backgroundColor = getCategoryColor(item.name, item.color);

    return (
      <TouchableOpacity 
        style={[styles.categoryCard, { backgroundColor }]}
        activeOpacity={0.8}
        onPress={() => {
          // TODO: Navigate to category details
          Alert.alert('Category Selected', `You selected ${item.name}`);
        }}
      >
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>#{item.category_id}</Text>
          </View>
        </View>
        
        {item.description && (
          <Text style={styles.categoryDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.categoryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.expert_count || 0}</Text>
            <Text style={styles.statLabelSmall}>Experts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.challenge_count || 0}</Text>
            <Text style={styles.statLabelSmall}>Challenges</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.question_count || 0}</Text>
            <Text style={styles.statLabelSmall}>Questions</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDashboardData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (categories.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Categories Yet</Text>
          <Text style={styles.emptyText}>
            Categories will appear here once they're added to the platform.
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderStats()}
        
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <Text style={styles.sectionSubtitle}>
            Discover coding challenges and connect with experts
          </Text>
          
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.category_id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    backgroundColor: '#007AFF',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  expertBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  expertBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  categoriesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  categoriesList: {
    paddingBottom: 20,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: (screenWidth - 48) / 2,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    lineHeight: 16,
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabelSmall: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});

export default DashboardScreen;
