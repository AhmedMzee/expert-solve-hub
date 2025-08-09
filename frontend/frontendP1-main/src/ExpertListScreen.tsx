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
  Image,
} from 'react-native';
import { useUser } from './context/UserContext';
import { expertService, Expert, ExpertFilters } from './services/expertService';

interface ExpertListScreenProps {
  navigation?: any;
}

const ExpertListScreen: React.FC<ExpertListScreenProps> = ({ navigation }) => {
  // ==========================
  // STATE MANAGEMENT
  // ==========================
  const { user } = useUser();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ExpertFilters>({
    sort_by: 'rating',
    limit: 20,
    offset: 0
  });
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<'available' | 'busy' | 'offline' | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Expertise areas and stats
  const [expertiseAreas, setExpertiseAreas] = useState<Array<{
    area: string;
    expert_count: number;
    avg_rating: number;
  }>>([]);
  const [totalExperts, setTotalExperts] = useState(0);
  const [availableExperts, setAvailableExperts] = useState(0);

  // ==========================
  // DATA LOADING
  // ==========================

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2 || searchQuery.length === 0) {
      loadExpertsWithFilters();
    }
  }, [searchQuery, selectedExpertise, selectedAvailability, activeFilters.sort_by]);

  const initializeData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadExperts(),
        loadExpertiseAreas()
      ]);
    } catch (error) {
      console.error('Initialize data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExperts = async (reset: boolean = true) => {
    try {
      const filters: ExpertFilters = {
        ...activeFilters,
        offset: reset ? 0 : experts.length,
        expertise_area: selectedExpertise || undefined,
        availability_status: selectedAvailability || undefined,
        search: searchQuery.length > 2 ? searchQuery : undefined
      };

      const result = await expertService.getAll(filters);
      
      if (reset) {
        setExperts(result.experts);
        setTotalExperts(result.total);
        setAvailableExperts(result.experts.filter(e => e.availability_status === 'available').length);
      } else {
        setExperts(prev => [...prev, ...result.experts]);
      }
      
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Load experts error:', error);
      Alert.alert('Error', 'Failed to load experts');
    }
  };

  const loadExpertsWithFilters = () => {
    loadExperts(true);
  };

  const loadExpertiseAreas = async () => {
    try {
      const areas = await expertService.getExpertiseAreas();
      setExpertiseAreas(areas);
    } catch (error) {
      console.error('Load expertise areas error:', error);
    }
  };

  // ==========================
  // REFRESH & PAGINATION
  // ==========================

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadExperts(true);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [activeFilters, selectedExpertise, selectedAvailability, searchQuery]);

  const loadMoreExperts = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      await loadExperts(false);
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // ==========================
  // ACTIONS & NAVIGATION
  // ==========================

  const handleExpertPress = async (expert: Expert) => {
    try {
      // Navigate to expert profile (will be implemented later)
      Alert.alert(
        expert.full_name,
        `${expert.bio}\n\nExpertise: ${expert.expertise_areas.join(', ')}\nExperience: ${expert.years_experience} years\nStatus: ${expert.availability_status}`,
        [
          { text: 'Close', style: 'cancel' },
          { text: 'View Profile', onPress: () => handleViewProfile(expert) },
          user ? { text: 'Follow', onPress: () => handleFollowExpert(expert.user_id) } : null,
          expert.availability_status === 'available' ? { text: 'Request Help', onPress: () => handleRequestMentorship(expert) } : null
        ].filter(Boolean) as any
      );
    } catch (error) {
      console.error('Expert press error:', error);
    }
  };

  const handleViewProfile = (expert: Expert) => {
    Alert.alert('Expert Profile', 'Expert profile feature coming soon!');
  };

  const handleFollowExpert = async (expertId: number) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to follow experts');
      return;
    }

    try {
      await expertService.followExpert(expertId);
      Alert.alert('Success', 'You are now following this expert!');
      // Update local state or refresh
    } catch (error) {
      console.error('Follow error:', error);
      Alert.alert('Error', 'Failed to follow expert');
    }
  };

  const handleRequestMentorship = (expert: Expert) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to request mentorship');
      return;
    }
    Alert.alert('Request Mentorship', 'Mentorship request feature coming soon!');
  };

  // ==========================
  // FILTER FUNCTIONS
  // ==========================

  const clearFilters = () => {
    setSelectedExpertise(null);
    setSelectedAvailability(null);
    setSearchQuery('');
    setActiveFilters(prev => ({ ...prev, sort_by: 'rating' }));
  };

  const applySortFilter = (sortBy: 'rating' | 'experience' | 'answers' | 'newest' | 'price_low' | 'price_high') => {
    setActiveFilters(prev => ({ ...prev, sort_by: sortBy }));
  };

  // ==========================
  // RENDER COMPONENTS
  // ==========================

  const renderStatsHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{totalExperts}</Text>
        <Text style={styles.statLabel}>Total Experts</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{availableExperts}</Text>
        <Text style={styles.statLabel}>Available Now</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{expertiseAreas.length}</Text>
        <Text style={styles.statLabel}>Expertise Areas</Text>
      </View>
    </View>
  );

  const renderSearchAndFilters = () => (
    <View style={styles.searchFilterContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search experts by name or company..."
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
              { key: 'rating', label: 'Top Rated' },
              { key: 'experience', label: 'Most Experienced' },
              { key: 'answers', label: 'Most Answers' },
              { key: 'newest', label: 'Newest' },
              { key: 'price_low', label: 'Price: Low to High' },
              { key: 'price_high', label: 'Price: High to Low' }
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

          {/* Availability Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status: </Text>
            <TouchableOpacity
              style={[
                styles.filterPill,
                !selectedAvailability && styles.filterPillActive
              ]}
              onPress={() => setSelectedAvailability(null)}
            >
              <Text style={[
                styles.filterPillText,
                !selectedAvailability && styles.filterPillTextActive
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {[
              { key: 'available', label: '🟢 Available', color: '#34C759' },
              { key: 'busy', label: '🟡 Busy', color: '#FF9500' },
              { key: 'offline', label: '🔴 Offline', color: '#FF3B30' }
            ].map((status) => (
              <TouchableOpacity
                key={status.key}
                style={[
                  styles.filterPill,
                  selectedAvailability === status.key && styles.filterPillActive
                ]}
                onPress={() => setSelectedAvailability(status.key as any)}
              >
                <Text style={[
                  styles.filterPillText,
                  selectedAvailability === status.key && styles.filterPillTextActive
                ]}>
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Expertise Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <Text style={styles.filterLabel}>Expertise: </Text>
            <TouchableOpacity
              style={[
                styles.filterPill,
                !selectedExpertise && styles.filterPillActive
              ]}
              onPress={() => setSelectedExpertise(null)}
            >
              <Text style={[
                styles.filterPillText,
                !selectedExpertise && styles.filterPillTextActive
              ]}>
                All Areas
              </Text>
            </TouchableOpacity>
            {expertiseAreas.slice(0, 8).map((area) => (
              <TouchableOpacity
                key={area.area}
                style={[
                  styles.filterPill,
                  selectedExpertise === area.area && styles.filterPillActive
                ]}
                onPress={() => setSelectedExpertise(area.area)}
              >
                <Text style={[
                  styles.filterPillText,
                  selectedExpertise === area.area && styles.filterPillTextActive
                ]}>
                  {area.area} ({area.expert_count})
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

  const renderExpertCard = ({ item }: { item: Expert }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'available': return '#34C759';
        case 'busy': return '#FF9500';
        case 'offline': return '#FF3B30';
        default: return '#666';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'available': return '🟢';
        case 'busy': return '🟡';
        case 'offline': return '🔴';
        default: return '⚪';
      }
    };

    return (
      <TouchableOpacity 
        style={styles.expertCard}
        onPress={() => handleExpertPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.expertHeader}>
          <View style={styles.avatarContainer}>
            {item.profile_image_url ? (
              <Image source={{ uri: item.profile_image_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {item.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
            )}
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.availability_status) }]} />
          </View>

          <View style={styles.expertInfo}>
            <View style={styles.expertNameRow}>
              <Text style={styles.expertName}>{item.full_name}</Text>
              {item.availability_status === 'available' && (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableText}>Available</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.expertTitle}>@{item.username}</Text>
            
            {item.company && (
              <Text style={styles.expertCompany}>📍 {item.company}</Text>
            )}
            
            {item.location && (
              <Text style={styles.expertLocation}>🌍 {item.location}</Text>
            )}
          </View>

          <View style={styles.expertStats}>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>⭐ 4.8</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{item.years_experience}y exp</Text>
            </View>
            {item.hourly_rate && (
              <View style={styles.statRow}>
                <Text style={styles.statValue}>${item.hourly_rate}/hr</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.expertBio} numberOfLines={2}>
          {item.bio}
        </Text>

        <View style={styles.expertiseContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.expertise_areas.slice(0, 4).map((area, index) => (
              <View key={index} style={styles.expertiseTag}>
                <Text style={styles.expertiseText}>{area}</Text>
              </View>
            ))}
            {item.expertise_areas.length > 4 && (
              <View style={styles.expertiseTag}>
                <Text style={styles.expertiseText}>+{item.expertise_areas.length - 4} more</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.expertActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleViewProfile(item)}>
            <Text style={styles.actionButtonText}>View Profile</Text>
          </TouchableOpacity>
          
          {item.availability_status === 'available' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={() => handleRequestMentorship(item)}
            >
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Request Help</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading more experts...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Experts Found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery ? 'Try adjusting your search or filters' : 'No experts available at the moment'}
      </Text>
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
          <Text style={styles.loadingText}>Loading Experts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expert Mentors</Text>
        {user?.user_type === 'expert' && (
          <View style={styles.expertBadge}>
            <Text style={styles.expertBadgeText}>You're an Expert!</Text>
          </View>
        )}
      </View>

      <FlatList
        data={experts}
        renderItem={renderExpertCard}
        keyExtractor={(item) => item.user_id.toString()}
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
        onEndReached={loadMoreExperts}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={experts.length === 0 ? styles.emptyListContainer : undefined}
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
    backgroundColor: '#34C759',
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
    justifyContent: 'space-around',
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
  expertCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expertHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  expertInfo: {
    flex: 1,
    marginRight: 12,
  },
  expertNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  expertName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  availableBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  availableText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  expertTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  expertCompany: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 2,
  },
  expertLocation: {
    fontSize: 12,
    color: '#666',
  },
  expertStats: {
    alignItems: 'flex-end',
  },
  statRow: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  expertBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  expertiseContainer: {
    marginBottom: 15,
  },
  expertiseTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  expertiseText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  expertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  primaryButtonText: {
    color: 'white',
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
    lineHeight: 22,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
});

export default ExpertListScreen;
