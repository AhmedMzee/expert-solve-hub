# 🚀 ExpertSolve Hub - 2-Day Development Roadmap

> **GOAL: Build a complete mentorship platform in 48 hours!**

## 🎯 Project Overview
**ExpertSolve Hub** is a React Native mentorship platform connecting learners with experts through coding challenges and Q&A sessions.

### Quick Start
```bash
# Backend (Terminal 1)
cd ../backend/backendp1-main
npm start

# Frontend (Terminal 2) 
npm install @react-native-async-storage/async-storage axios
npx expo start
```

---
# 🔥 DAY 1: CORE FUNCTIONALITY (16 Hours)

## ⏰ MORNING (8:00 AM - 12:00 PM) - 4 Hours

### Hour 1: Backend & Environment Setup (8:00-9:00 AM)
**🎯 Priority: Get backend running + IP configuration**

```bash
# 1. Start Backend (5 min)
cd ../backend/backendp1-main
npm start
# ✅ Verify: http://localhost:3000 shows API running

# 2. Get Your IP Address (5 min)
hostname -I | awk '{print $1}'  # Linux
# Write down: 192.168.x.x

# 3. Frontend Dependencies (10 min)
npm install @react-native-async-storage/async-storage axios
```

**🔥 CRITICAL FILE 1:** `src/config/environment.ts`
```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://192.168.X.X:3000/api'  // ⚠️ REPLACE WITH YOUR IP!
    : 'https://production-api.com/api',
  TIMEOUT: 10000,
};
```

**🔥 CRITICAL FILE 2:** `src/services/baseService.ts`
```typescript
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

**✅ CHECKPOINT:** Test API connection in browser: `http://YOUR_IP:3000`

---

### Hour 2: Authentication System (9:00-10:00 AM)
**🎯 Priority: Complete login/register functionality**

**🔥 CRITICAL FILE 3:** `src/services/authService.ts`
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './baseService';

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  username: string;
  user_type: 'user' | 'expert';
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

**🔥 CRITICAL FILE 4:** `src/context/UserContext.tsx`
```typescript
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



### Hour 3: Navigation & Core Screens (10:00-11:00 AM)
**🎯 Priority: App structure with login/dashboard**

**🔥 CRITICAL FILE 5:** `App.tsx`
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserProvider, useUser } from './src/context/UserContext';
import { ActivityIndicator, View } from 'react-native';

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

**🔥 CRITICAL FILE 6:** `src/screens/auth/LoginScreen.tsx`
```typescript
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

**✅ CHECKPOINT:** Login screen appears, can navigate to signup

---

### Hour 4: Categories & Dashboard (11:00 AM-12:00 PM)
**🎯 Priority: Display data from backend**

**🔥 CRITICAL FILE 7:** `src/services/categoryService.ts`
```typescript
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

**🔥 CRITICAL FILE 8:** `src/screens/dashboard/DashboardScreen.tsx`
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
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

**✅ CHECKPOINT:** Categories load from backend, dashboard shows user data



## ⏰ AFTERNOON (1:00 PM - 6:00 PM) - 5 Hours

### Hour 5-6: Challenge System (1:00-3:00 PM)
**🎯 Priority: Challenge listing and navigation**

**🔥 CRITICAL FILE 9:** `src/services/challengeService.ts`
```typescript
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

**🔥 CRITICAL FILE 10:** `src/screens/challenges/ChallengeListScreen.tsx`
```typescript
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



### Hour 7-8: Question System (3:00-5:00 PM)
**🎯 Priority: Q&A functionality**

**🔥 CRITICAL FILE 11:** `src/services/questionService.ts`
```typescript
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
next}

export const questionService = new QuestionService();
```

**🔥 CRITICAL FILE 12:** `src/screens/questions/QuestionListScreen.tsx`
```typescript
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

---

### Hour 9: Expert System + Navigation (5:00-6:00 PM)
**🎯 Priority: Complete tab navigation**

**🔥 CRITICAL FILE 13:** `src/services/expertService.ts` + `src/screens/experts/ExpertListScreen.tsx`
```typescript
// Expert Service
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

// Expert Screen
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

**Update App.tsx MainTabs:**
```typescript
const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Challenges" component={ChallengeListScreen} />
    <Tab.Screen name="Questions" component={QuestionListScreen} />
    <Tab.Screen name="Experts" component={ExpertListScreen} />
  </Tab.Navigator>
);
```

**✅ END OF DAY 1 TARGET:** Working app with all 4 main tabs functional!



## ⏰ EVENING (7:00 PM - 10:00 PM) - 3 Hours

### Hour 10-12: Registration + Polish (7:00-10:00 PM)
**🎯 Priority: Complete signup flow + visual polish**

- Complete SignupScreen.tsx with proper form validation
- Add loading states and error handling
- Polish UI styling and user experience
- Final testing and bug fixes

**✅ END OF DAY 1:** Fully functional mentorship platform with login, categories, challenges, questions, and experts!

---

# 🔥 DAY 2: ADVANCED FEATURES (12 Hours)

## ⏰ MORNING (8:00 AM - 12:00 PM) - 4 Hours
- **Hour 1-2:** Ask Question feature + form handling
- **Hour 3-4:** Challenge details view + solutions

## ⏰ AFTERNOON (1:00 PM - 6:00 PM) - 5 Hours  
- **Hour 5-6:** Expert profiles + answer system
- **Hour 7-8:** Search & filtering capabilities
- **Hour 9:** UI polish + user experience

## ⏰ EVENING (7:00 PM - 10:00 PM) - 3 Hours
- **Hour 10-12:** Final testing, debugging, and deployment preparation

---

## 🎯 Critical Success Checkpoints

### ✅ END OF DAY 1 - MUST HAVE:
- [ ] Backend running on network
- [ ] Login/Register working  
- [ ] Dashboard showing categories
- [ ] Challenges, Questions, Experts tabs working
- [ ] Basic navigation between screens

### ✅ END OF DAY 2 - MUST HAVE:
- [ ] Ask questions functionality
- [ ] Challenge details view
- [ ] Expert profiles with answers
- [ ] Search capabilities
- [ ] Fully functional mentorship platform

---

## 🚨 Emergency Shortcuts

**Skip if behind schedule:**
- Advanced styling (use basic styles)
- Complex animations (focus on functionality)  
- Detailed validation (simple validation only)

**Must-have core features:**
1. ✅ Authentication (login/register)
2. ✅ View categories/challenges/questions
3. ✅ Basic navigation
4. ✅ Expert listings

---

## 🔥 START NOW!

```bash
# Execute immediately:
cd ../backend/backendp1-main
npm start &

npm install @react-native-async-storage/async-storage axios
```

**⚠️ CRITICAL:** Update `src/config/environment.ts` with YOUR IP ADDRESS first!

You have **48 hours** to build a complete mentorship platform. **GO!** 🚀
