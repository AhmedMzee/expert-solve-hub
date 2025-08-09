// Export all screens for easy importing
// Auth screens
import LoginScreen from './auth/LoginScreen';
import SignupScreen from './auth/SignupScreen';
import ForgotPasswordScreen from './auth/ForgotPasswordScreen';

// Dashboard screens
import DashboardScreen from './dashboard/DashboardScreen';
import RoleBasedDashboard from './dashboard/RoleBasedDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import ExpertDashboard from './dashboard/ExpertDashboard';
import StudentDashboard from './dashboard/StudentDashboard';
import WelcomeScreen from './dashboard/WelcomeScreen';

// Profile screens
import ProfileScreen from './profile/ProfileScreen';
import EditProfileScreen from './profile/EditProfileScreen';
import ChangePasswordScreen from './profile/ChangePasswordScreen';

// Challenge screens
import Challenges from './challenges/Challenges';
import SolutionScreen from './challenges/SolutionScreen';

// Question screens
import QuestionsScreen from './questions/QuestionsScreen';
import Answer from './questions/Answer';

// Settings screens
import SettingsScreen from './settings/SettingsScreen';
import PrivacySettings from './settings/PrivacySettings';
import ContactUs from './settings/ContactUs';

export {
  // Auth
  LoginScreen,
  SignupScreen,
  ForgotPasswordScreen,
  
  // Dashboard
  DashboardScreen,
  RoleBasedDashboard,
  AdminDashboard,
  ExpertDashboard,
  StudentDashboard,
  WelcomeScreen,
  
  // Profile
  ProfileScreen,
  EditProfileScreen,
  ChangePasswordScreen,
  
  // Challenges
  Challenges,
  SolutionScreen,
  
  // Questions
  QuestionsScreen,
  Answer,
  
  // Settings
  SettingsScreen,
  PrivacySettings,
  ContactUs,
};
