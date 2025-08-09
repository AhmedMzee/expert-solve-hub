import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { UserProvider, useUser } from './src/context/UserContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Import Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import RoleBasedDashboard from './src/screens/dashboard/RoleBasedDashboard';
// import QuestionsScreen from './src/QuestionsScreen';
// import Challenges from './src/Challenges';
// import ExpertListScreen from './src/ExpertListScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';

// Temporary placeholder components
const QuestionsScreen = () => null;
const Challenges = () => null;
const ExpertListScreen = () => null;

// Navigation Type Definitions
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  Questions: undefined;
  Challenges: undefined;
  ExpertList: undefined;
};

export type RootStackParamList = AuthStackParamList & MainStackParamList;

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator 
      initialRouteName="Login"
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false 
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// Main Navigator
const MainNavigator = () => {
  return (
    <MainStack.Navigator 
      initialRouteName="Dashboard"
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <MainStack.Screen name="Dashboard" component={RoleBasedDashboard} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="Questions" component={QuestionsScreen} />
      <MainStack.Screen name="Challenges" component={Challenges} />
      <MainStack.Screen name="ExpertList" component={ExpertListScreen} />
    </MainStack.Navigator>
  );
};

// Root Navigator Component
const RootNavigator = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// Main App Component
export default function App() {
  return (
    <UserProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});
