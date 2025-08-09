import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import api from '../config/api';

const NetworkTest = () => {
  const [status, setStatus] = useState('Not tested');

  const testConnection = async () => {
    try {
      setStatus('Testing...');
      const response = await api.get('/users/experts');
      setStatus(`Success: ${response.status}`);
      Alert.alert('Success', 'Backend connection working!');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', `Connection failed: ${error.message}`);
      console.error('Connection test failed:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Test Backend Connection" onPress={testConnection} />
      <Text style={{ marginTop: 10 }}>Status: {status}</Text>
    </View>
  );
};

export default NetworkTest;