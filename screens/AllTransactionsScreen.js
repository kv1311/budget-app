import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { loadAllTransactionsList } from '../utils/storage';

export default function AllTransactionsScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadAllTransactionsList().then(setTransactions);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
    >
      <View style={styles.transactionHeader}>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <Text style={styles.amountText}>₹{item.amount.toFixed(2)}</Text>
      </View>
      <Text style={styles.descriptionText}>{item.description}</Text>
      <Text style={styles.categoryText}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContent: {
    padding: 16,
  },
  transactionItem: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateText: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
  },
  amountText: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: '#ccc',
    fontFamily: 'Courier',
    fontSize: 14,
    marginBottom: 4,
  },
  categoryText: {
    color: '#666',
    fontFamily: 'Courier',
    fontSize: 12,
  },
});