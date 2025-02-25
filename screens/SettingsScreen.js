import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const menuItems = [
    { 
      title: 'Primary Account', 
      icon: 'wallet-outline', 
      action: () => navigation.navigate('Accounts')
    },
    { 
      title: 'Recently Deleted', 
      icon: 'trash-outline', 
      action: () => navigation.navigate('DeletedTransactions')
    },
    { title: 'Currency', icon: 'cash-outline', action: () => {} },
    { title: 'Analyze', icon: 'bar-chart-outline', action: () => {} },
    { title: 'Export', icon: 'download-outline', action: () => {} },
    { title: 'Backup', icon: 'cloud-upload-outline', action: () => {} },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.container}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
            <Ionicons name={item.icon} size={24} color="#fff" />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Courier',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemText: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 16,
    marginLeft: 16,
  },
});