import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ContactUs: React.FC = () => {
  const navigation = useNavigation();

  const handleEmail = () => {
    Linking.openURL('swalihinamachano@gmail.com');
  };

  const handleCall = () => {
    Linking.openURL('tel:+2556084205');
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.logo}
        />
        
        <Text style={styles.description}>
          We're here to help you with any questions or concerns you may have.
        </Text>

        <View style={styles.contactCard}>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={24} color="#3498db" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>swalihinamachano@gmail.com</Text>
            </View>
            <TouchableOpacity onPress={handleEmail} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Send</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={24} color="#3498db" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+ (255) 608-4205</Text>
            </View>
            <TouchableOpacity onPress={handleCall} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactItem}>
            {/* <Ionicons name="globe-outline" size={24} color="#3498db" /> */}
            {/* <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Website</Text>
              <Text style={styles.contactValue}>swalihinamachano@gmail.com</Text>
            </View> */}
            {/* <TouchableOpacity onPress={handleWebsite} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Visit</Text>
            </TouchableOpacity>  */}
          </View>
        </View>

        <Text style={styles.hours}>
          Customer Support Hours:{'\n'}
          Monday - Friday: 9AM - 6PM{'\n'}
          Saturday: 10AM - 4PM
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 24,
    backgroundColor: '#e0e0e0',
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  contactCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactText: {
    flex: 1,
    marginLeft: 16,
  },
  contactLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  hours: {
    marginTop: 24,
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ContactUs;