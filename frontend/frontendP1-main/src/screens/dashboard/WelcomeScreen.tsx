import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  DashboardScreen: undefined;
};

type WelcomeScreenProps = {
  route: { params: { fullName?: string } };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'DashboardScreen'>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();

  const fullName= route.params?.fullName?.trim() || '';
  const initial = fullName.charAt(0).toUpperCase(); // Herufi ya kwanza ya jina lote

  const handleContinue = () => {
    navigation.navigate('DashboardScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <Text style={styles.welcomeText}>Welcome, {fullName}</Text>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8e44ad', // Rangi ya zambarau
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 30,
    textTransform: 'capitalize',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
