import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useUser } from './context/UserContext';
import { questionService, Question, QuestionFilters } from './services/questionService';
import { categoryService, Category } from './services/categoryService';

interface QuestionsScreenProps {
  navigation?: any;
}

const QuestionsScreen: React.FC<QuestionsScreenProps> = ({ navigation }) => {
  // ==========================
  // STATE MANAGEMENT
  // ==========================
  const { user } = useUser();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<QuestionFilters>({
    sort_by: 'newest',
    limit: 20,
    offset: 0
  });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Stats State
  const [stats, setStats] = useState({
    total_questions: 0,
    unanswered_questions: 0,
    resolved_questions: 0
  });

  // ==========================
  // DATA LOADING
  // ==========================

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2 || searchQuery.length === 0) {
      loadQuestionsWithFilters();
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, activeFilters.sort_by]);

  const initializeData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCategories(),
        loadQuestions(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Initialize data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoryData = await categoryService.getAll();
      setCategories(categoryData);
    } catch (error) {
      console.error('Load categories error:', error);
    }
  };

  const loadQuestions = async (reset: boolean = true) => {
    try {
      const filters: QuestionFilters = {
        ...activeFilters,
        offset: reset ? 0 : questions.length,
        category_id: selectedCategory || undefined,
        difficulty_level: selectedDifficulty || undefined,
        search: searchQuery.length > 2 ? searchQuery : undefined
      };

      const result = await questionService.getAll(filters);
      
      if (reset) {
        setQuestions(result.questions);
      } else {
        setQuestions(prev => [...prev, ...result.questions]);
      }
      
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Load questions error:', error);
      Alert.alert('Error', 'Failed to load questions');
    }
  };

  const loadQuestionsWithFilters = () => {
    loadQuestions(true);
  };

  const loadStats = async () => {
    try {
      const statsData = await questionService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  // ==========================
  // REFRESH & PAGINATION
  // ==========================

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadQuestions(true),
        loadStats()
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [activeFilters, selectedCategory, selectedDifficulty, searchQuery]);

  const loadMoreQuestions = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      await loadQuestions(false);
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // ==========================
  // ACTIONS & NAVIGATION
  // ==========================

  const handleAskQuestion = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to ask a question');
      return;
    }
    // Navigate to ask question screen (will be implemented later)
    Alert.alert('Ask Question', 'Ask Question feature coming soon!');
  };

  const handleQuestionPress = async (question: Question) => {
    try {
      // Increment view count and navigate to question detail
      // For now, show question details in alert
      Alert.alert(
        question.title,
        `${question.content}\n\nAsked by: ${question.asked_by_name}\nCategory: ${question.category_name}\nAnswers: ${question.answer_count}`,
        [
          { text: 'Close', style: 'cancel' },
          user?.user_type === 'expert' ? { text: 'Answer', onPress: () => handleAnswerQuestion(question) } : null
        ].filter(Boolean) as any
      );
    } catch (error) {
      console.error('Question press error:', error);
    }
  };

  const handleAnswerQuestion = (question: Question) => {
    if (user?.user_type !== 'expert') {
      Alert.alert('Expert Only', 'Only experts can answer questions');
      return;
    }
    Alert.alert('Answer Question', 'Answer feature coming soon!');
  };

  const handleUpvoteQuestion = async (questionId: number) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to upvote');
      return;
    }

    try {
      await questionService.upvoteQuestion(questionId);
      // Update local state
      setQuestions(prev => prev.map(q => 
        q.question_id === questionId 
          ? { ...q, upvotes_count: q.upvotes_count + 1 }
          : q
      ));
    } catch (error) {
      console.error('Upvote error:', error);
      Alert.alert('Error', 'Failed to upvote question');
    }
  };

  // ==========================
  // FILTER FUNCTIONS
  // ==========================

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSearchQuery('');
    setActiveFilters(prev => ({ ...prev, sort_by: 'newest' }));
  };

  const applySortFilter = (sortBy: 'newest' | 'oldest' | 'most_answers' | 'most_votes' | 'unanswered') => {
    setActiveFilters(prev => ({ ...prev, sort_by: sortBy }));
  };

  // ==========================
  // RENDER COMPONENTS
  // ==========================

  const renderStatsHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.total_questions}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.unanswered_questions}</Text>
        <Text style={styles.statLabel}>Unanswered</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.resolved_questions}</Text>
        <Text style={styles.statLabel}>Resolved</Text>
      </View>
      {user && (
        <TouchableOpacity style={styles.askButton} onPress={handleAskQuestion}>
          <Text style={styles.askButtonText}>Ask Question</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSearchAndFilters = () => (
    <View style={styles.searchFilterContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search questions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Sort Options */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <Text style={styles.filterLabel}>Sort: </Text>
            {[
              { key: 'newest', label: 'Newest' },
              { key: 'most_answers', label: 'Most Answers' },
              { key: 'most_votes', label: 'Most Voted' },
              { key: 'unanswered', label: 'Unanswered' }
            ].map((sort) => (
              <TouchableOpacity
                key={sort.key}
                style={[
                  styles.filterPill,
                  activeFilters.sort_by === sort.key && styles.filterPillActive
                ]}
                onPress={() => applySortFilter(sort.key as any)}
              >
                <Text style={[
                  styles.filterPillText,
                  activeFilters.sort_by === sort.key && styles.filterPillTextActive
                ]}>
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <Text style={styles.filterLabel}>Category: </Text>
            <TouchableOpacity
              style={[
                styles.filterPill,
                !selectedCategory && styles.filterPillActive
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[
                styles.filterPillText,
                !selectedCategory && styles.filterPillTextActive
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.category_id}
                style={[
                  styles.filterPill,
                  selectedCategory === category.category_id && styles.filterPillActive
                ]}
                onPress={() => setSelectedCategory(category.category_id)}
              >
                <Text style={[
                  styles.filterPillText,
                  selectedCategory === category.category_id && styles.filterPillTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Difficulty Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <Text style={styles.filterLabel}>Level: </Text>
            <TouchableOpacity
              style={[
                styles.filterPill,
                !selectedDifficulty && styles.filterPillActive
              ]}
              onPress={() => setSelectedDifficulty(null)}
            >
              <Text style={[
                styles.filterPillText,
                !selectedDifficulty && styles.filterPillTextActive
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.filterPill,
                  selectedDifficulty === level && styles.filterPillActive
                ]}
                onPress={() => setSelectedDifficulty(level)}
              >
                <Text style={[
                  styles.filterPillText,
                  selectedDifficulty === level && styles.filterPillTextActive
                ]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderQuestionCard = ({ item }: { item: Question }) => {
    const getDifficultyColor = (level?: string) => {
      switch (level) {
        case 'beginner': return '#34C759';
        case 'intermediate': return '#FF9500';
        case 'advanced': return '#FF3B30';
        default: return '#666';
      }
    };

    const getTimeSince = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return date.toLocaleDateString();
    };

    return (
      <TouchableOpacity 
        style={styles.questionCard}
        onPress={() => handleQuestionPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.questionHeader}>
          <View style={styles.questionTitleContainer}>
            <Text style={styles.questionTitle} numberOfLines={2}>
              {item.title}
            </Text>
            {item.difficulty_level && (
              <Text style={[
                styles.difficultyBadge,
                { color: getDifficultyColor(item.difficulty_level) }
              ]}>
                {item.difficulty_level.toUpperCase()}
              </Text>
            )}
          </View>
          {item.is_resolved && (
            <View style={styles.resolvedBadge}>
              <Text style={styles.resolvedText}>✓ Resolved</Text>
            </View>
          )}
        </View>

        <Text style={styles.questionContent} numberOfLines={3}>
          {item.content}
        </Text>

        <View style={styles.questionFooter}>
          <View style={styles.questionMeta}>
            <Text style={styles.categoryTag}>{item.category_name}</Text>
            <Text style={styles.metaText}>
              by {item.asked_by_name} • {getTimeSince(item.created_at)}
            </Text>
          </View>

          <View style={styles.questionStats}>
            <TouchableOpacity 
              style={styles.statButton}
              onPress={() => handleUpvoteQuestion(item.question_id)}
            >
              <Text style={styles.statButtonText}>👍 {item.upvotes_count}</Text>
            </TouchableOpacity>
            <View style={styles.statButton}>
              <Text style={styles.statButtonText}>💬 {item.answer_count}</Text>
            </View>
            <View style={styles.statButton}>
              <Text style={styles.statButtonText}>👁 {item.views_count}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading more questions...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Questions Found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery ? 'Try adjusting your search or filters' : 'Be the first to ask a question!'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.askButton} onPress={handleAskQuestion}>
          <Text style={styles.askButtonText}>Ask First Question</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ==========================
  // MAIN RENDER
  // ==========================

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading Questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Questions & Answers</Text>
        {user?.user_type === 'expert' && (
          <View style={styles.expertBadge}>
            <Text style={styles.expertBadgeText}>Expert</Text>
          </View>
        )}
      </View>

      <FlatList
        data={questions}
        renderItem={renderQuestionCard}
        keyExtractor={(item) => item.question_id.toString()}
        ListHeaderComponent={
          <View>
            {renderStatsHeader()}
            {renderSearchAndFilters()}
          </View>
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreQuestions}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={questions.length === 0 ? styles.emptyListContainer : undefined}
      />
    </SafeAreaView>
  );
};

// ==========================
// STYLES
// ==========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  expertBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expertBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  statsContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  askButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  askButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchFilterContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  filterToggle: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  filterToggleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  filtersContainer: {
    paddingTop: 10,
  },
  filterRow: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
    paddingVertical: 8,
  },
  filterPill: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#007AFF',
  },
  filterPillText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: 'white',
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
  },
  clearFiltersText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  questionCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  questionTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 24,
  },
  difficultyBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  resolvedBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resolvedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionMeta: {
    flex: 1,
  },
  categoryTag: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  questionStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statButton: {
    marginLeft: 15,
  },
  statButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
});

export default QuestionsScreen;
