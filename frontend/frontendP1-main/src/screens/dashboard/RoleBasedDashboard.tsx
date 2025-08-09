import React from 'react';
import { useUser } from '../../context/UserContext';
import AdminDashboard from './AdminDashboard';
import ExpertDashboard from './ExpertDashboard';
import StudentDashboard from './StudentDashboard';
import DashboardScreen from './DashboardScreen'; // Fallback

const RoleBasedDashboard: React.FC = () => {
  const { user } = useUser();

  // Route to appropriate dashboard based on user type
  switch (user?.user_type) {
    case 'admin':
      return <AdminDashboard />;
    case 'expert':
      return <ExpertDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'user': // Legacy user type, treat as student
      return <StudentDashboard />;
    default:
      // Fallback to original dashboard if user type is unknown
      return <DashboardScreen />;
  }
};

export default RoleBasedDashboard;
