import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loadDeletedTransactions, restoreTransaction, clearDeletedTransactions } from '../utils/storage';

export default function DeletedTransactionsScreen({ navigation }) {
  const [deletedTransactions, setDeletedTransactions] = useState([]);

  useEffect(() => {
    loadDeletedTransactions().then(setDeletedTransactions);
  }, []);

  const handleRestore = async (transaction) => {
    await restoreTransaction(transaction);
    setDeletedTransactions(prev => prev.filter(t => t.id !== transaction.id));
    // Navigation refresh will happen via focus effect in HomeScreen
  };

  const handleClearAll = async () => {
    await clearDeletedTransactions();
    setDeletedTransactions([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Recently Deleted</Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearAll}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={deletedTransactions}
        renderItem={({ item }) => (
          <View style={styles.transactionRow}>
            <View style={styles.transactionInfo}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
              {item.category && <Text style={styles.tag}>#{item.category}</Text>}
            </View>
            <TouchableOpacity 
              style={styles.restoreButton}
              onPress={() => handleRestore(item)}
            >
              <Ionicons name="reload" size={20} color="#0a84ff" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
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
  clearButton: {
    paddingHorizontal: 16,
  },
  clearButtonText: {
    color: '#ff3b30',
    fontFamily: 'Courier',
    fontSize: 14,
  },
  transactionRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  restoreButton: {
    padding: 8,
  },
  description: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
  },
  amount: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
  },
  tag: {
    color: '#666',
    fontFamily: 'Courier',
    fontSize: 14,
  },
});
