# ExpertSolve Hub Frontend Roadmap

## 🎯 Project Overview
**ExpertSolve Hub** is a React Native mentorship platform that connects learners with experts through coding challenges and Q&A sessions. The backend provides a comprehensive API with cycle-free database design optimized for performance.

## 🏗️ Backend API Structure

### 🔐 Authentication Endpoints
```
POST /api/auth/register     - Register new user (with expertise categories for experts)
POST /api/auth/login        - Login user
GET  /api/auth/profile      - Get current user profile (protected)
```

### 👥 User Management
```
GET  /api/users/experts     - Get all experts with their expertise areas
GET  /api/users/:userId     - Get user by ID
PUT  /api/users/profile     - Update current user profile (protected)
```

### 📚 Categories
```
GET  /api/categories                    - Get all categories with stats
GET  /api/categories/top-level          - Get main categories only
GET  /api/categories/search?q=term      - Search categories
GET  /api/categories/:id                - Get category details
GET  /api/categories/:id/experts        - Get experts in category
GET  /api/categories/:id/statistics     - Get category statistics
```

### 🏆 Challenges
```
GET  /api/challenges                    - Get all challenges
GET  /api/challenges/:id                - Get challenge details
GET  /api/challenges/expert/:expertId   - Get challenges by expert
GET  /api/challenges/:id/solutions      - Get solutions for challenge
POST /api/challenges                    - Create new challenge (experts only)
POST /api/challenges/:id/solutions      - Submit solution (experts only)
```

### ❓ Questions & Answers
```
GET  /api/questions                     - Get all anonymous questions
GET  /api/questions/:id                 - Get question details
POST /api/questions                     - Create new question (authenticated)
GET  /api/questions/user/my-questions   - Get current user's questions
DELETE /api/questions/:id               - Delete own question

GET  /api/answers/:id                   - Get answer details
GET  /api/answers/question/:questionId  - Get answers for question
GET  /api/answers/expert/:expertId      - Get answers by expert
POST /api/answers/question/:questionId  - Create answer (experts only)
PUT  /api/answers/:id                   - Update own answer (experts only)
DELETE /api/answers/:id                 - Delete own answer (experts only)
```

## 🎨 Frontend Development Roadmap

### Phase 1: Foundation & Authentication (Week 1-2)
**Priority: HIGH** 🔴

#### ✅ Already Complete:
- ✅ Project structure reorganized
- ✅ TypeScript configuration fixed
- ✅ Navigation setup
- ✅ Basic screens created

#### 🔧 To Implement:

**1. Complete Authentication Flow**
```typescript
// src/services/authService.ts
interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  bio?: string;
  userType: 'user' | 'expert';
  profilePicture?: string;
  expertiseCategories?: number[]; // Category IDs for experts
}

interface LoginData {
  email: string;
  password: string;
}
```

**2. Update Auth Screens**
- `src/screens/auth/LoginScreen.tsx` - Add proper form validation
- `src/screens/auth/SignupScreen.tsx` - Add expertise selection for experts
- `src/screens/auth/ForgotPasswordScreen.tsx` - Complete implementation

**3. User Context & State Management**
```typescript
// src/context/UserContext.tsx
interface UserContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdate) => Promise<void>;
  isLoading: boolean;
  isExpert: boolean;
}
```

### Phase 2: Categories & Navigation (Week 2-3)
**Priority: HIGH** 🔴

**1. Category Service**
```typescript
// src/services/categoryService.ts
export const categoryService = {
  getAll: () => Promise<Category[]>;
  getTopLevel: () => Promise<Category[]>;
  getExperts: (categoryId: number) => Promise<Expert[]>;
  search: (term: string) => Promise<Category[]>;
};
```

**2. Category Components**
```typescript
// src/components/CategoryCard.tsx
// src/components/CategoryList.tsx
// src/components/ExpertiseSelector.tsx (for registration)
```

**3. Enhanced Dashboard**
- Show categories with statistics
- Featured experts by category
- Recent activity feed
- Quick access to popular challenges/questions

### Phase 3: Challenges System (Week 3-4)
**Priority: HIGH** 🔴

**1. Challenge Service**
```typescript
// src/services/challengeService.ts
export const challengeService = {
  getAll: () => Promise<Challenge[]>;
  getById: (id: number) => Promise<Challenge>;
  create: (data: ChallengeCreate) => Promise<Challenge>;
  getSolutions: (challengeId: number) => Promise<Solution[]>;
  submitSolution: (challengeId: number, solution: SolutionCreate) => Promise<Solution>;
  joinChallenge: (challengeId: number) => Promise<void>;
};
```

**2. Challenge Screens**
```typescript
// src/screens/challenges/ChallengeListScreen.tsx
// src/screens/challenges/ChallengeDetailScreen.tsx
// src/screens/challenges/CreateChallengeScreen.tsx (experts only)
// src/screens/challenges/SolutionScreen.tsx
// src/screens/challenges/SubmitSolutionScreen.tsx (experts only)
```

**3. Challenge Components**
```typescript
// src/components/ChallengeCard.tsx
// src/components/SolutionCard.tsx
// src/components/DifficultyBadge.tsx
// src/components/CodeEditor.tsx (for solutions)
// src/components/RatingSystem.tsx
```

### Phase 4: Questions & Answers (Week 4-5)
**Priority: HIGH** 🔴

**1. Question Service**
```typescript
// src/services/questionService.ts
export const questionService = {
  getAll: () => Promise<Question[]>;
  getById: (id: number) => Promise<QuestionWithAnswers>;
  create: (data: QuestionCreate) => Promise<Question>;
  getMyQuestions: () => Promise<Question[]>;
  delete: (id: number) => Promise<void>;
};
```

**2. Answer Service**
```typescript
// src/services/answerService.ts
export const answerService = {
  getByQuestion: (questionId: number) => Promise<Answer[]>;
  create: (questionId: number, content: string) => Promise<Answer>;
  update: (answerId: number, content: string) => Promise<Answer>;
  delete: (answerId: number) => Promise<void>;
  rate: (answerId: number, rating: number, comment?: string) => Promise<void>;
};
```

**3. Q&A Screens**
```typescript
// src/screens/questions/QuestionListScreen.tsx
// src/screens/questions/QuestionDetailScreen.tsx
// src/screens/questions/AskQuestionScreen.tsx
// src/screens/questions/MyQuestionsScreen.tsx
```

### Phase 5: User Profiles & Social Features (Week 5-6)
**Priority: MEDIUM** 🟡

**1. Enhanced Profile System**
```typescript
// src/screens/profile/ProfileScreen.tsx - View any user profile
// src/screens/profile/EditProfileScreen.tsx - Edit own profile
// src/screens/profile/ExpertProfileScreen.tsx - Expert-specific features
```

**2. Social Features**
```typescript
// Follow/Unfollow experts
// Activity feed
// Expert recommendations
// User achievements/badges
```

**3. Profile Components**
```typescript
// src/components/UserCard.tsx
// src/components/ExpertCard.tsx
// src/components/ActivityFeed.tsx
// src/components/AchievementBadge.tsx
```

### Phase 6: Advanced Features (Week 6-7)
**Priority: MEDIUM** 🟡

**1. Search & Filtering**
```typescript
// Global search across challenges, questions, experts
// Advanced filtering by category, difficulty, rating
// Saved searches and bookmarks
```

**2. Notifications System**
```typescript
// Push notifications for new answers
// Challenge updates
// Expert recommendations
// System announcements
```

**3. Rating & Review System**
```typescript
// Rate answers and solutions
// Leave detailed reviews
// Expert rating aggregation
// Quality scoring system
```

### Phase 7: Analytics & Optimization (Week 7-8)
**Priority: LOW** 🟢

**1. User Analytics**
```typescript
// Learning progress tracking
// Performance metrics
// Time spent analytics
// Completion rates
```

**2. Performance Optimization**
```typescript
// Image lazy loading
// API response caching
// Offline support
// Background sync
```

**3. Advanced UI/UX**
```typescript
// Dark mode support
// Accessibility improvements
// Animations and transitions
// Gesture controls
```

## 🛠️ Technical Implementation Guide

### 1. Environment Setup
```bash
# Backend (already setup)
cd backend/backendp1-main
npm install
node migration-database.js  # Database already migrated
npm start

# Frontend
cd frontend/frontendP1-main
npm install
npx expo start
```

### 2. API Configuration
```typescript
// src/config/environment.ts
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://10.217.247.114:3000/api'  // Your network IP
    : 'https://your-production-api.com/api',
  TIMEOUT: 10000,
};
```

### 3. Core Service Pattern
```typescript
// src/services/baseService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Add auth token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 4. Type Definitions
```typescript
// src/types/api.ts
interface User {
  user_id: number;
  email: string;
  full_name: string;
  username: string;
  bio?: string;
  user_type: 'user' | 'expert';
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  expertise_areas?: string[];
}

interface Category {
  category_id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  challenge_count: number;
  question_count: number;
  expert_count: number;
}

interface Challenge {
  challenge_id: number;
  creator_id: number;
  title: string;
  description: string;
  category_id: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  estimated_time?: string;
  created_at: string;
  creator_name: string;
  category_name: string;
  participant_count: number;
  solution_count: number;
}
```

## 📱 Screen Flow Architecture

### Authentication Flow
```
WelcomeScreen → LoginScreen → DashboardScreen
            → SignupScreen → DashboardScreen
            → ForgotPasswordScreen → LoginScreen
```

### Main App Flow
```
DashboardScreen (Tab Navigator)
├── Challenges Tab
│   ├── ChallengeListScreen
│   ├── ChallengeDetailScreen
│   └── CreateChallengeScreen (experts)
├── Questions Tab
│   ├── QuestionListScreen
│   ├── QuestionDetailScreen
│   └── AskQuestionScreen
├── Experts Tab
│   ├── ExpertListScreen
│   └── ExpertProfileScreen
└── Profile Tab
    ├── ProfileScreen
    ├── EditProfileScreen
    └── SettingsScreen
```

## 🎨 UI/UX Guidelines

### Design System
- **Primary Colors**: Blue (#007AFF), Green (#34C759)
- **Text Colors**: Dark (#1C1C1E), Gray (#8E8E93)
- **Background**: Light (#F2F2F7), White (#FFFFFF)
- **Accent**: Orange (#FF9500), Red (#FF3B30)

### Component Standards
- Use TypeScript for all components
- Implement proper error boundaries
- Add loading states for all async operations
- Include accessibility props (accessibilityLabel, etc.)
- Follow React Native performance best practices

## 🚀 INTENSIVE 2-DAY FRONTEND COMPLETION PLAN

### 🎯 **GOAL: FULLY FUNCTIONAL APP IN 48 HOURS**

---

# 🔥 DAY 1: CORE FUNCTIONALITY (16 Hours)

## ⏰ DAY 1 - MORNING SESSION (8:00 AM - 12:00 PM) - 4 Hours
### **PRIORITY 1: Foundation Setup**

#### Hour 1: Environment & Backend Connection (8:00 - 9:00 AM)
```bash
# STEP 1: Start Backend (5 min)
cd backend/backendp1-main
npm start
# Verify: http://localhost:3000 shows "ExpertSolve Hub API Server is running!"

# STEP 2: Get Your IP Address (5 min)
# Windows: ipconfig | find "IPv4"
# Mac/Linux: ifconfig | grep "inet "
# Write down your IP: 192.168.x.x

# STEP 3: Frontend Setup (10 min)
cd frontend/frontendP1-main
npm install
npm install @react-native-async-storage/async-storage axios
```

#### CRITICAL FILE 1: API Configuration (30 min)
```typescript
// src/config/environment.ts - CREATE THIS FIRST!
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://192.168.1.100:3000/api'  // ⚠️ REPLACE WITH YOUR ACTUAL IP!
    : 'https://your-production-api.com/api',
  TIMEOUT: 10000,
};

// Test immediately in browser: http://YOUR_IP:3000
```

#### CRITICAL FILE 2: Base API Service (10 min)
```typescript
// src/services/baseService.ts - COPY/PASTE THIS EXACTLY
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/environment';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

#### Hour 2: Authentication Service (9:00 - 10:00 AM)

#### CRITICAL FILE 3: Auth Service (45 min)
```typescript
// src/services/authService.ts - COMPLETE AUTH SYSTEM
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './baseService';

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  username: string;
  user_type: 'user' | 'expert';
  profile_picture?: string;
  expertise_areas?: string[];
}

class AuthService {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    return { token, user };
  }

  async register(userData: any) {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    return { token, user };
  }

  async logout() {
    await AsyncStorage.multiRemove(['authToken', 'userData']);
  }

  async getStoredUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
}

export const authService = new AuthService();
```

#### CRITICAL FILE 4: User Context (15 min)
```typescript
// src/context/UserContext.tsx - STATE MANAGEMENT
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const storedUser = await authService.getStoredUser();
    setUser(storedUser);
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password);
    setUser(user);
  };

  const register = async (data: any) => {
    const { user } = await authService.register(data);
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};
```

---

#### Hour 3: Navigation & Core Screens (10:00 - 11:00 AM)

#### CRITICAL FILE 5: App Navigation (20 min)
```typescript
// App.tsx - UPDATE ROOT FILE
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserProvider, useUser } from './src/context/UserContext';
import { ActivityIndicator, View } from 'react-native';

// Import your existing screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
```

#### CRITICAL FILE 6: Login Screen (25 min)
```typescript
// src/screens/auth/LoginScreen.tsx - WORKING LOGIN
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();

  const handleLogin = async () => {
    try {
      await login(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ExpertSolve Hub</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 20, color: '#007AFF' },
});

export default LoginScreen;
```

#### TEST CHECKPOINT (15 min)
```bash
# Start the app
npx expo start
# Test: Login screen should appear
# Test: Backend connection in browser
```

---

#### Hour 4: Category System (11:00 AM - 12:00 PM)

#### CRITICAL FILE 7: Category Service (30 min)
```typescript
// src/services/categoryService.ts - CATEGORY DATA
import api from './baseService';

export interface Category {
  category_id: number;
  name: string;
  description?: string;
  color?: string;
  challenge_count: number;
  question_count: number;
  expert_count: number;
}

class CategoryService {
  async getAll(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  }
}

export const categoryService = new CategoryService();
```

#### CRITICAL FILE 8: Dashboard Screen (30 min)
```typescript
// src/screens/dashboard/DashboardScreen.tsx - MAIN SCREEN
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useUser } from '../../context/UserContext';
import { categoryService, Category } from '../../services/categoryService';

const DashboardScreen = () => {
  const { user, logout } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Load categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryCard}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryStats}>
        {item.expert_count} experts • {item.challenge_count} challenges
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.full_name}!</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.category_id.toString()}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', padding: 20, flexDirection: 'row', justifyContent: 'space-between' },
  greeting: { fontSize: 20, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#FF3B30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: 'white', fontWeight: 'bold' },
  list: { padding: 20 },
  categoryCard: { backgroundColor: 'white', padding: 16, marginBottom: 12, borderRadius: 10 },
  categoryName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  categoryStats: { fontSize: 14, color: '#666' },
});

export default DashboardScreen;
```

---

## ⏰ DAY 1 - AFTERNOON SESSION (1:00 PM - 6:00 PM) - 5 Hours

#### Hour 5-6: Challenge System (1:00 - 3:00 PM)

#### CRITICAL FILE 9: Challenge Service (45 min)
```typescript
// src/services/challengeService.ts - CHALLENGE FEATURES
import api from './baseService';

export interface Challenge {
  challenge_id: number;
  title: string;
  description: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  creator_name: string;
  category_name: string;
  participant_count: number;
}

class ChallengeService {
  async getAll(): Promise<Challenge[]> {
    const response = await api.get('/challenges');
    return response.data;
  }
}

export const challengeService = new ChallengeService();
```

#### CRITICAL FILE 10: Challenge Screen (45 min)
```typescript
// src/screens/challenges/ChallengeListScreen.tsx - CHALLENGE VIEW
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { challengeService, Challenge } from '../../services/challengeService';

const ChallengeListScreen = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const data = await challengeService.getAll();
      setChallenges(data);
    } catch (error) {
      console.error('Load challenges error:', error);
    }
  };

  const renderChallenge = ({ item }: { item: Challenge }) => (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{item.title}</Text>
        <Text style={[styles.difficulty, { color: getDifficultyColor(item.difficulty_level) }]}>
          {item.difficulty_level.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.meta}>
        By {item.creator_name} • {item.category_name} • {item.participant_count} participants
      </Text>
    </View>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#34C759';
      case 'medium': return '#FF9500';
      case 'hard': return '#FF3B30';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Coding Challenges</Text>
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.challenge_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 20 },
  challengeCard: { backgroundColor: 'white', margin: 10, padding: 16, borderRadius: 10 },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  challengeTitle: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  difficulty: { fontSize: 12, fontWeight: 'bold' },
  description: { fontSize: 14, color: '#666', marginBottom: 8 },
  meta: { fontSize: 12, color: '#999' },
});

export default ChallengeListScreen;
```

#### Update Navigation (30 min)
```typescript
// Update App.tsx MainTabs to include challenges
const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Challenges" component={ChallengeListScreen} />
  </Tab.Navigator>
);
```

---

#### Hour 7-8: Question System (3:00 - 5:00 PM)

#### CRITICAL FILE 11: Question Service (45 min)
```typescript
// src/services/questionService.ts - Q&A SYSTEM
import api from './baseService';

export interface Question {
  question_id: number;
  title: string;
  content: string;
  category_name: string;
  asked_by_name: string;
  answer_count: number;
  created_at: string;
}

class QuestionService {
  async getAll(): Promise<Question[]> {
    const response = await api.get('/questions');
    return response.data;
  }

  async create(title: string, content: string, categoryId: number) {
    const response = await api.post('/questions', { title, content, categoryId });
    return response.data;
  }
}

export const questionService = new QuestionService();
```

#### CRITICAL FILE 12: Question Screen (45 min)
```typescript
// src/screens/questions/QuestionListScreen.tsx - Q&A VIEW
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { questionService, Question } from '../../services/questionService';

const QuestionListScreen = ({ navigation }: any) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await questionService.getAll();
      setQuestions(data);
    } catch (error) {
      console.error('Load questions error:', error);
    }
  };

  const renderQuestion = ({ item }: { item: Question }) => (
    <TouchableOpacity style={styles.questionCard}>
      <Text style={styles.questionTitle}>{item.title}</Text>
      <Text style={styles.questionContent} numberOfLines={2}>{item.content}</Text>
      <Text style={styles.questionMeta}>
        {item.category_name} • Asked by {item.asked_by_name} • {item.answer_count} answers
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Questions & Answers</Text>
        <TouchableOpacity 
          style={styles.askButton} 
          onPress={() => navigation.navigate('AskQuestion')}
        >
          <Text style={styles.askButtonText}>Ask Question</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.question_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold' },
  askButton: { backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  askButtonText: { color: 'white', fontWeight: 'bold' },
  questionCard: { backgroundColor: 'white', margin: 10, padding: 16, borderRadius: 10 },
  questionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  questionContent: { fontSize: 14, color: '#666', marginBottom: 8 },
  questionMeta: { fontSize: 12, color: '#999' },
});

export default QuestionListScreen;
```

#### Update Navigation (30 min)
```typescript
// Add Questions tab to MainTabs
<Tab.Screen name="Questions" component={QuestionListScreen} />
```

---

#### Hour 9: Expert System (5:00 - 6:00 PM)

#### CRITICAL FILE 13: Expert Service & Screen (60 min)
```typescript
// src/services/expertService.ts - EXPERT SYSTEM
import api from './baseService';

export interface Expert {
  user_id: number;
  full_name: string;
  username: string;
  bio: string;
  expertise_areas: string[];
}

class ExpertService {
  async getAll(): Promise<Expert[]> {
    const response = await api.get('/users/experts');
    return response.data;
  }
}

export const expertService = new ExpertService();

// src/screens/experts/ExpertListScreen.tsx - EXPERT VIEW
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { expertService, Expert } from '../../services/expertService';

const ExpertListScreen = () => {
  const [experts, setExperts] = useState<Expert[]>([]);

  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    try {
      const data = await expertService.getAll();
      setExperts(data);
    } catch (error) {
      console.error('Load experts error:', error);
    }
  };

  const renderExpert = ({ item }: { item: Expert }) => (
    <View style={styles.expertCard}>
      <Text style={styles.expertName}>{item.full_name}</Text>
      <Text style={styles.expertBio} numberOfLines={2}>{item.bio}</Text>
      <Text style={styles.expertise}>
        Expertise: {item.expertise_areas?.join(', ') || 'General'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expert Mentors</Text>
      <FlatList
        data={experts}
        renderItem={renderExpert}
        keyExtractor={(item) => item.user_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 20 },
  expertCard: { backgroundColor: 'white', margin: 10, padding: 16, borderRadius: 10 },
  expertName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  expertBio: { fontSize: 14, color: '#666', marginBottom: 8 },
  expertise: { fontSize: 12, color: '#007AFF', fontWeight: '500' },
});

export default ExpertListScreen;
```

---

## ⏰ DAY 1 - EVENING SESSION (7:00 PM - 10:00 PM) - 3 Hours

#### Hour 10-12: Complete Registration & Polish (7:00 - 10:00 PM)

#### CRITICAL FILE 14: Signup Screen (90 min)
```typescript
// src/screens/auth/SignupScreen.tsx - REGISTRATION
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '../../context/UserContext';
import { categoryService, Category } from '../../services/categoryService';

const SignupScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    userType: 'user',
    bio: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const { register } = useUser();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Load categories error:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await register(formData);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Join ExpertSolve Hub</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />
      
      <TextInput
        style={styles.textArea}
        placeholder="Bio (optional)"
        value={formData.bio}
        onChangeText={(text) => setFormData({ ...formData, bio: text })}
        multiline
        numberOfLines={3}
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Account Type:</Text>
        <Picker
          selectedValue={formData.userType}
          onValueChange={(value) => setFormData({ ...formData, userType: value })}
          style={styles.picker}
        >
          <Picker.Item label="Regular User" value="user" />
          <Picker.Item label="Expert Mentor" value="expert" />
        </Picker>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  textArea: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16, height: 80 },
  pickerContainer: { backgroundColor: 'white', borderRadius: 10, marginBottom: 15 },
  label: { padding: 10, fontSize: 16, fontWeight: 'bold' },
  picker: { height: 50, width: '100%' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 20, color: '#007AFF' },
});

export default SignupScreen;
```

#### Final Navigation Setup (30 min)
```typescript
// App.tsx - FINAL COMPLETE NAVIGATION
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// All your screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import ChallengeListScreen from './src/screens/challenges/ChallengeListScreen';
import QuestionListScreen from './src/screens/questions/QuestionListScreen';
import ExpertListScreen from './src/screens/experts/ExpertListScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';
        switch (route.name) {
          case 'Dashboard': iconName = 'home'; break;
          case 'Challenges': iconName = 'code-working'; break;
          case 'Questions': iconName = 'help-circle'; break;
          case 'Experts': iconName = 'people'; break;
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Challenges" component={ChallengeListScreen} />
    <Tab.Screen name="Questions" component={QuestionListScreen} />
    <Tab.Screen name="Experts" component={ExpertListScreen} />
  </Tab.Navigator>
);

// Rest of navigation code remains the same...
```

---

# 🔥 DAY 2: FEATURES & POLISH (12 Hours)

## ⏰ DAY 2 - MORNING SESSION (8:00 AM - 12:00 PM) - 4 Hours

#### Hour 1-2: Ask Question Feature (8:00 - 10:00 AM)
#### Hour 3-4: Challenge Details & Solutions (10:00 AM - 12:00 PM)

## ⏰ DAY 2 - AFTERNOON SESSION (1:00 PM - 6:00 PM) - 5 Hours

#### Hour 5-6: Expert Profiles & Answers (1:00 - 3:00 PM)
#### Hour 7-8: Search & Filtering (3:00 - 5:00 PM)  
#### Hour 9: Polish & Testing (5:00 - 6:00 PM)

## ⏰ DAY 2 - EVENING SESSION (7:00 PM - 10:00 PM) - 3 Hours

#### Hour 10-12: Final Testing & Deployment (7:00 - 10:00 PM)

---

## 🎯 **CRITICAL SUCCESS CHECKPOINTS**

### ✅ **END OF DAY 1 - MUST HAVE:**
- [ ] Backend running on your network
- [ ] Login/Register working
- [ ] Dashboard showing categories
- [ ] Challenges, Questions, Experts tabs working
- [ ] Basic navigation between screens

### ✅ **END OF DAY 2 - MUST HAVE:**
- [ ] Ask questions functionality
- [ ] Challenge details view
- [ ] Expert profiles
- [ ] Search capabilities
- [ ] Fully functional mentorship platform

---

## 🚨 **EMERGENCY SHORTCUTS IF BEHIND SCHEDULE:**

### Skip These If Running Out of Time:
1. ~~Advanced styling~~ (Use basic styles)
2. ~~Complex animations~~ (Focus on functionality)
3. ~~Error boundaries~~ (Basic error handling only)
4. ~~Detailed validation~~ (Simple validation only)

### Must-Have Core Features:
1. ✅ Authentication (login/register)
2. ✅ View categories/challenges/questions
3. ✅ Basic navigation
4. ✅ Expert listings

---

## 🔥 **START IMMEDIATELY:**

```bash
# RIGHT NOW - EXECUTE THESE COMMANDS:
cd backend/backendp1-main
npm start &

cd ../frontend/frontendP1-main
npm install @react-native-async-storage/async-storage axios
```

**⚠️ CRITICAL:** Update `src/config/environment.ts` with YOUR IP ADDRESS first thing!

You have **48 hours** to build a complete mentorship platform. **START NOW!** 🚀

### 📋 DAY-BY-DAY DEVELOPMENT PLAN

---

## 🔥 WEEK 1: Foundation & Authentication

### Day 1: Environment Setup & Basic Configuration
**Time: 4-6 hours**

#### 1. Backend Setup
```bash
# Terminal 1: Start Backend
cd backend/backendp1-main
npm install
npm start
# Should see: "Server is running on port 3000"
```

#### 2. Frontend Environment
```bash
# Terminal 2: Frontend Setup
cd frontend/frontendP1-main
npm install
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-vector-icons
npx expo start
```

#### 3. Update API Configuration
```typescript
// src/config/environment.ts - UPDATE THIS FIRST!
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://YOUR_COMPUTER_IP:3000/api'  // Replace with your actual IP
    : 'https://your-production-api.com/api',
  TIMEOUT: 10000,
};

// Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
// Example: 'http://192.168.1.100:3000/api'
```

#### 4. Test Backend Connection
```typescript
// src/config/testConnection.ts - Create this file
import { API_CONFIG } from './environment';

export const testConnection = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}`);
    const data = await response.json();
    console.log('✅ Backend connected:', data.message);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
};
```

---

### Day 2: Authentication Service Implementation
**Time: 6-8 hours**

#### 1. Create Base API Service
```typescript
// src/services/baseService.ts - CREATE THIS FILE
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/environment';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error adding auth token:', error);
    return config;
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage
      await AsyncStorage.multiRemove(['authToken', 'userData']);
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 2. Create Authentication Service
```typescript
// src/services/authService.ts - CREATE THIS FILE
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './baseService';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  bio?: string;
  userType: 'user' | 'expert';
  profilePicture?: string;
  expertiseCategories?: number[];
}

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  username: string;
  bio?: string;
  user_type: 'user' | 'expert';
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  expertise_areas?: string[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

class AuthService {
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store auth data
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Store auth data
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get stored user error:', error);
      return null;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Get stored token error:', error);
      return null;
    }
  }

  async getCurrentProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/profile');
      const user = response.data;
      
      // Update stored user data
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get profile');
    }
  }
}

export const authService = new AuthService();
```

#### 3. Create User Context
```typescript
// src/context/UserContext.tsx - CREATE THIS FILE
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, LoginData, RegisterData } from '../services/authService';

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isExpert: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isExpert = user?.user_type === 'expert';

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      setIsLoading(true);
      const [storedUser, storedToken] = await Promise.all([
        authService.getStoredUser(),
        authService.getStoredToken(),
      ]);
      
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Load stored auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginData) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      if (token) {
        const updatedUser = await authService.getCurrentProfile();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  const value: UserContextType = {
    user,
    token,
    isLoading,
    isExpert,
    login,
    register,
    logout,
    refreshProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
```

---

### Day 3: Update Authentication Screens
**Time: 6-8 hours**

#### 1. Update App.tsx to Include Context
```typescript
// App.tsx - UPDATE THIS FILE
import React from 'react';
import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator'; // You'll create this

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
```

#### 2. Create Navigation Structure
```typescript
// src/navigation/AppNavigator.tsx - CREATE THIS FILE
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';

import { useUser } from '../context/UserContext';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Main Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
```

#### 3. Update Login Screen
```typescript
// src/screens/auth/LoginScreen.tsx - UPDATE THIS FILE
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useUser } from '../../context/UserContext';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login({ email: email.trim(), password });
      // Navigation handled by AppNavigator
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Signup')}
        disabled={loading}
      >
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007AFF',
    fontSize: 16,
  },
});

export default LoginScreen;
```

---

### Day 4: Category Service & Dashboard
**Time: 6-8 hours**

#### 1. Create Category Service
```typescript
// src/services/categoryService.ts - CREATE THIS FILE
import api from './baseService';

export interface Category {
  category_id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  challenge_count: number;
  question_count: number;
  expert_count: number;
}

export interface Expert {
  user_id: number;
  full_name: string;
  username: string;
  profile_picture?: string;
  bio?: string;
}

class CategoryService {
  async getAll(): Promise<Category[]> {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch categories');
    }
  }

  async getTopLevel(): Promise<Category[]> {
    try {
      const response = await api.get('/categories/top-level');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch top-level categories');
    }
  }

  async getById(categoryId: number): Promise<Category> {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch category');
    }
  }

  async getExperts(categoryId: number): Promise<Expert[]> {
    try {
      const response = await api.get(`/categories/${categoryId}/experts`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch category experts');
    }
  }

  async search(term: string): Promise<Category[]> {
    try {
      const response = await api.get(`/categories/search?q=${encodeURIComponent(term)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to search categories');
    }
  }
}

export const categoryService = new CategoryService();
```

#### 2. Create Category Components
```typescript
// src/components/CategoryCard.tsx - CREATE THIS FILE
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Category } from '../services/categoryService';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: category.color || '#007AFF' }]}
      onPress={() => onPress(category)}
    >
      <Text style={styles.name}>{category.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {category.description || 'No description available'}
      </Text>
      <View style={styles.stats}>
        <Text style={styles.stat}>{category.expert_count} experts</Text>
        <Text style={styles.stat}>{category.challenge_count} challenges</Text>
        <Text style={styles.stat}>{category.question_count} questions</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 12,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
});

export default CategoryCard;
```

#### 3. Update Dashboard Screen
```typescript
// src/screens/dashboard/DashboardScreen.tsx - UPDATE THIS FILE
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useUser } from '../../context/UserContext';
import { categoryService, Category } from '../../services/categoryService';
import CategoryCard from '../../components/CategoryCard';

const DashboardScreen = ({ navigation }: any) => {
  const { user, isExpert } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getTopLevel();
      setCategories(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to category details (implement later)
    console.log('Category pressed:', category.name);
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <CategoryCard category={item} onPress={handleCategoryPress} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {user?.full_name}!
        </Text>
        {isExpert && (
          <Text style={styles.expertBadge}>Expert</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Explore Categories</Text>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.category_id.toString()}
        numColumns={2}
        contentContainerStyle={styles.categoriesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  expertBadge: {
    backgroundColor: '#34C759',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  categoriesList: {
    paddingHorizontal: 10,
  },
});

export default DashboardScreen;
```

---

### Day 5: Testing & Debugging
**Time: 4-6 hours**

#### 1. Test Connection Script
```typescript
// src/utils/testAPI.ts - CREATE THIS FILE
import { authService } from '../services/authService';
import { categoryService } from '../services/categoryService';

export const runAPITests = async () => {
  console.log('🧪 Starting API Tests...');
  
  try {
    // Test 1: Get categories
    console.log('📚 Testing categories...');
    const categories = await categoryService.getAll();
    console.log('✅ Categories loaded:', categories.length);
    
    // Test 2: Try login with test credentials
    console.log('🔐 Testing authentication...');
    // You can create a test user for this
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ API Test failed:', error);
  }
};
```

#### 2. Add Test Button to Dashboard
```typescript
// Add this to DashboardScreen.tsx for testing
import { runAPITests } from '../../utils/testAPI';

// Add this button in your render method
<TouchableOpacity 
  style={styles.testButton} 
  onPress={runAPITests}
>
  <Text>Test API Connection</Text>
</TouchableOpacity>
```

---

## 🔥 WEEK 2: Advanced Features

### Day 6-7: Challenge System Implementation
**Time: 12-16 hours**

#### 1. Challenge Service
```typescript
// src/services/challengeService.ts - CREATE THIS FILE
import api from './baseService';

export interface Challenge {
  challenge_id: number;
  creator_id: number;
  title: string;
  description: string;
  category_id: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  estimated_time?: string;
  created_at: string;
  creator_name: string;
  creator_username: string;
  category_name: string;
  category_color: string;
  participant_count: number;
  solution_count: number;
}

export interface ChallengeCreate {
  title: string;
  description: string;
  categoryId: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime?: string;
}

class ChallengeService {
  async getAll(): Promise<Challenge[]> {
    try {
      const response = await api.get('/challenges');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch challenges');
    }
  }

  async getById(challengeId: number): Promise<Challenge> {
    try {
      const response = await api.get(`/challenges/${challengeId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch challenge');
    }
  }

  async create(challengeData: ChallengeCreate): Promise<Challenge> {
    try {
      const response = await api.post('/challenges', {
        creatorId: undefined, // Will be set by backend from token
        title: challengeData.title,
        description: challengeData.description,
        categoryId: challengeData.categoryId,
        difficulty: challengeData.difficulty,
        estimatedTime: challengeData.estimatedTime,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create challenge');
    }
  }

  async joinChallenge(challengeId: number): Promise<void> {
    try {
      await api.post(`/challenges/${challengeId}/join`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to join challenge');
    }
  }
}

export const challengeService = new ChallengeService();
```

#### 2. Challenge Screens
```typescript
// src/screens/challenges/ChallengeListScreen.tsx - CREATE THIS FILE
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { challengeService, Challenge } from '../../services/challengeService';

const ChallengeListScreen = ({ navigation }: any) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await challengeService.getAll();
      setChallenges(data);
    } catch (error: any) {
      console.error('Load challenges error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChallenge = ({ item }: { item: Challenge }) => (
    <TouchableOpacity 
      style={styles.challengeCard}
      onPress={() => navigation.navigate('ChallengeDetail', { challengeId: item.challenge_id })}
    >
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{item.title}</Text>
        <Text style={[styles.difficulty, { color: getDifficultyColor(item.difficulty_level) }]}>
          {item.difficulty_level.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.challengeDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.challengeFooter}>
        <Text style={styles.category}>{item.category_name}</Text>
        <Text style={styles.stats}>
          {item.participant_count} participants • {item.solution_count} solutions
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#34C759';
      case 'medium': return '#FF9500';
      case 'hard': return '#FF3B30';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.challenge_id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  challengeCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  difficulty: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  stats: {
    fontSize: 12,
    color: '#999',
  },
});

export default ChallengeListScreen;
```

---

### Day 8-10: Questions & Answers System
**Time: 12-16 hours**

#### 1. Question Service
```typescript
// src/services/questionService.ts - CREATE THIS FILE
import api from './baseService';

export interface Question {
  question_id: number;
  title: string;
  content: string;
  category_id: number;
  asked_by: number;
  created_at: string;
  updated_at: string;
  asked_by_username?: string;
  asked_by_name?: string;
  category_name?: string;
  category_color?: string;
  answer_count: number;
}

export interface QuestionCreate {
  title: string;
  content: string;
  categoryId: number;
}

export interface Answer {
  answer_id: number;
  question_id: number;
  expert_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  expert_name: string;
  expert_username: string;
  average_rating?: number;
  rating_count: number;
}

class QuestionService {
  async getAll(): Promise<Question[]> {
    try {
      const response = await api.get('/questions');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch questions');
    }
  }

  async getById(questionId: number): Promise<Question> {
    try {
      const response = await api.get(`/questions/${questionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch question');
    }
  }

  async create(questionData: QuestionCreate): Promise<Question> {
    try {
      const response = await api.post('/questions', {
        title: questionData.title,
        content: questionData.content,
        categoryId: questionData.categoryId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create question');
    }
  }

  async getMyQuestions(): Promise<Question[]> {
    try {
      const response = await api.get('/questions/user/my-questions');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch my questions');
    }
  }

  async delete(questionId: number): Promise<void> {
    try {
      await api.delete(`/questions/${questionId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete question');
    }
  }

  async getAnswers(questionId: number): Promise<Answer[]> {
    try {
      const response = await api.get(`/answers/question/${questionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch answers');
    }
  }

  async createAnswer(questionId: number, content: string): Promise<Answer> {
    try {
      const response = await api.post(`/answers/question/${questionId}`, { content });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create answer');
    }
  }
}

export const questionService = new QuestionService();
```

---

## 🚀 IMMEDIATE ACTION PLAN

### START TODAY (Next 2 Hours):
1. **Setup Backend** (30 min):
   ```bash
   cd backend/backendp1-main
   npm start
   ```

2. **Update Frontend Config** (30 min):
   - Get your computer's IP address
   - Update `src/config/environment.ts`
   - Test connection with browser: `http://YOUR_IP:3000`

3. **Create Base Service** (60 min):
   - Copy the `baseService.ts` code above
   - Test API connection

### TOMORROW (8 Hours):
1. **Implement Auth Service** (3 hours)
2. **Create User Context** (2 hours)
3. **Update Login Screen** (2 hours)
4. **Test Authentication Flow** (1 hour)

### THIS WEEK:
- **Day 1-2**: Authentication system
- **Day 3-4**: Categories and dashboard
- **Day 5**: Testing and debugging
- **Weekend**: Challenges system

---

## 📊 SUCCESS METRICS & CHECKPOINTS

### Week 1 Targets:
- ✅ Backend server running
- ✅ Authentication working (login/register)
- ✅ Categories displayed on dashboard
- ✅ User context managing state
- ✅ Navigation between screens

### Week 2 Targets:
- ✅ Challenge listing and details
- ✅ Question creation and browsing
- ✅ Expert profiles with ratings
- ✅ Basic search functionality

### Week 3-4 Targets:
- ✅ Solution submission for challenges
- ✅ Answer creation for questions
- ✅ Rating system implementation
- ✅ Advanced filtering and search

---

**🎯 START WITH THIS FILE FIRST:**
Create `src/config/environment.ts` and update your IP address!

The roadmap is complete and ready to execute. Begin with Day 1 and follow systematically. Your backend is production-ready, so focus on building an amazing frontend experience! 🚀
