// components/Menu.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

interface MenuProps {
  navigation: NavigationProp<RootStackParamList>;
}

const Menu: React.FC<MenuProps> = ({ navigation }) => {
  return (
    <View style={styles.bottomNav}>
      {[
        { name: 'Home', screen: 'Dashboard', icon: 'home' },
        { name: 'Challenges', screen: 'Challenges', icon: 'list' },
        { name: 'Solutions', screen: 'Solutions', icon: 'checkmark-circle' },
        { name: 'Profile', screen: 'Profile', icon: 'person' },
      ].map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => navigation.navigate(tab.screen as keyof RootStackParamList)}
        >
          <Ionicons name={tab.icon as any} size={24} color="white" />
          <Text style={styles.navText}>{tab.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e1e1e',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 12,
    marginTop: 3,
  },
});

export default Menu;