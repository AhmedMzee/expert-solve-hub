import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions
} from 'react-native';
import { useUser } from './context/UserContext';
import { challengeService, Challenge } from './services/challengeService';
import { categoryService, Category } from './services/categoryService';

const { width: screenWidth } = Dimensions.get('window');

interface ChallengesProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
  };
}

const Challenges: React.FC<ChallengesProps> = ({ navigation }) => {
  const { user, isExpert } = useUser();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter challenges when filters change
  useEffect(() => {
    filterChallenges();
  }, [selectedDifficulty, selectedCategory, searchQuery]);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Load challenges and categories in parallel
      const [challengesData, categoriesData] = await Promise.allSettled([
        challengeService.getAll(),
        categoryService.getAll(),
      ]);

      // Handle challenges result
      if (challengesData.status === 'fulfilled') {
        setChallenges(challengesData.value);
      } else {
        console.error('Challenges load failed:', challengesData.reason);
        setError('Failed to load challenges');
      }

      // Handle categories result
      if (categoriesData.status === 'fulfilled') {
        setCategories(categoriesData.value);
      } else {
        console.warn('Categories load failed:', categoriesData.reason);
      }

    } catch (error: any) {
      console.error('Challenges load error:', error);
      setError(error.message || 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const filterChallenges = async () => {
    try {
      const filters: any = {};
      
      if (selectedDifficulty !== 'all') {
        filters.difficulty_level = selectedDifficulty;
      }
      
      if (selectedCategory) {
        filters.category_id = selectedCategory;
      }

      let filteredChallenges: Challenge[];
      
      if (searchQuery.trim()) {
        // Use search if there's a query
        filteredChallenges = await challengeService.search(searchQuery.trim());
      } else {
        // Use filters
        filteredChallenges = await challengeService.getAll(filters);
      }

      setChallenges(filteredChallenges);
    } catch (error: any) {
      console.error('Filter challenges error:', error);
      setError('Failed to filter challenges');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleJoinChallenge = async (challengeId: number) => {
    try {
      await challengeService.join(challengeId);
      Alert.alert('Success', 'You have joined the challenge!');
      // Refresh the challenges to update participant count
      await loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join challenge');
    }
  };

  const handleCreateChallenge = () => {
    if (!isExpert) {
      Alert.alert('Permission Denied', 'Only experts can create challenges.');
      return;
    }
    // TODO: Navigate to create challenge screen
    Alert.alert('Create Challenge', 'Create challenge feature coming soon!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#34C759';
      case 'medium': return '#FF9500';
      case 'hard': return '#FF3B30';
      default: return '#666';
    }
  };

  const renderDifficultyFilter = () => {
    const difficulties = ['all', 'easy', 'medium', 'hard'];
    
    return (
      <View style={styles.filterRow}>
        {difficulties.map((difficulty) => (
          <TouchableOpacity
            key={difficulty}
            style={[
              styles.filterButton,
              selectedDifficulty === difficulty && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedDifficulty(difficulty)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedDifficulty === difficulty && styles.filterButtonTextActive,
              ]}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCategoryFilter = () => {
    if (categories.length === 0) return null;

    return (
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedCategory === null && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedCategory === null && styles.filterButtonTextActive,
            ]}
          >
            All Categories
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.category_id}
            style={[
              styles.filterButton,
              selectedCategory === category.category_id && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.category_id)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedCategory === category.category_id && styles.filterButtonTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Coding Challenges</Text>
        {isExpert && (
          <TouchableOpacity style={styles.createButton} onPress={handleCreateChallenge}>
            <Text style={styles.createButtonText}>+ Create</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search challenges..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View>
    </View>
  );

  const renderChallenge = ({ item, index }: { item: Challenge; index: number }) => {
    const difficultyColor = getDifficultyColor(item.difficulty_level);
    
    return (
      <TouchableOpacity 
        style={styles.challengeCard}
        activeOpacity={0.8}
        onPress={() => {
          // TODO: Navigate to challenge details
          Alert.alert('Challenge Selected', `You selected "${item.title}"`);
        }}
      >
        <View style={styles.challengeHeader}>
          <View style={styles.challengeTitleContainer}>
            <Text style={styles.challengeTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
              <Text style={styles.difficultyText}>
                {item.difficulty_level.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.challengeDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.challengeMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Category:</Text>
            <Text style={styles.metaValue}>{item.category_name}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>By:</Text>
            <Text style={styles.metaValue}>{item.creator_name}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Participants:</Text>
            <Text style={styles.metaValue}>{item.participant_count}</Text>
          </View>
        </View>
        
        <View style={styles.challengeActions}>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => handleJoinChallenge(item.challenge_id)}
          >
            <Text style={styles.joinButtonText}>Join Challenge</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (challenges.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Challenges Found</Text>
          <Text style={styles.emptyText}>
            {searchQuery ? 'Try adjusting your search terms.' : 'Be the first to create a challenge!'}
          </Text>
          {isExpert && (
            <TouchableOpacity style={styles.createFirstButton} onPress={handleCreateChallenge}>
              <Text style={styles.createFirstButtonText}>Create Challenge</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.challenge_id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        contentContainerStyle={styles.challengesList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.filtersContainer}>
            <Text style={styles.filterTitle}>Filter by Difficulty</Text>
            {renderDifficultyFilter()}
            <Text style={styles.filterTitle}>Filter by Category</Text>
            {renderCategoryFilter()}
          </View>
        }
      />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  filtersContainer: {
    padding: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
    marginTop: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  challengesList: {
    padding: 16,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  challengeHeader: {
    marginBottom: 12,
  },
  challengeTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  challengeMeta: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    width: 80,
  },
  metaValue: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  challengeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  joinButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    marginRight: 8,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  viewButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    marginLeft: 8,
  },
  viewButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
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
  createFirstButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Challenges;
