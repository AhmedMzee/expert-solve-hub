import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingItem {
  name: string;
  action?: () => void;
  customComponent?: React.ReactNode;
}

interface SettingsSection {
  title: string;
  icon: string;
  items: SettingItem[];
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [biometricLogin, setBiometricLogin] = useState<boolean>(false);

  const settingsSections: SettingsSection[] = [
    {
      title: "Account",
      icon: "person-outline",
      items: [
        { name: "Edit Profile", action: () => navigation.navigate('EditProfile') },
        { name: "Change Password", action: () => navigation.navigate('ChangePassword') },
      ],
    },
    {
      title: "Preferences",
      icon: "settings-outline",
      items: [
        {
          name: "Dark Mode",
          customComponent: (
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: "#bdc3c7", true: "#3498db" }}
              thumbColor={isDarkMode ? "#ffffff" : "#ffffff"}
            />
          ),
        },
        {
          name: "Notifications",
          customComponent: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#bdc3c7", true: "#3498db" }}
              thumbColor={notificationsEnabled ? "#ffffff" : "#ffffff"}
            />
          ),
        },
      ],
    },
    {
      title: "Security",
      icon: "lock-closed-outline",
      items: [
        {
          name: "Biometric Login",
          customComponent: (
            <Switch
              value={biometricLogin}
              onValueChange={setBiometricLogin}
              trackColor={{ false: "#bdc3c7", true: "#3498db" }}
              thumbColor={biometricLogin ? "#ffffff" : "#ffffff"}
            />
          ),
        },
        { name: "Privacy Settings", action: () => navigation.navigate('PrivacySettings') },
      ],
    },
    {
      title: "Support",
      icon: "help-circle-outline",
      items: [
        { name: "Contact Us", action: () => navigation.navigate('ContactUs') },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
            <Ionicons name="arrow-back" size={24} color="white" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            <View style={styles.sectionItems}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  {item.customComponent ? (
                    <View style={styles.settingItem}>
                      <Text style={styles.settingText}>{item.name}</Text>
                      {item.customComponent}
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.settingItem}
                      onPress={item.action}
                    >
                      <Text style={styles.settingText}>{item.name}</Text>
                      <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    color: '#2c3e50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  sectionTitle: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  sectionItems: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    color: '#2c3e50',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    color: '#95a5a6',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SettingsScreen;