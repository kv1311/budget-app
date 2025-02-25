import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Alert, Dimensions, KeyboardAvoidingView, Platform, Keyboard, Animated } from 'react-native';
import TopBar from '../components/TopBar';
import TransactionList from '../components/TransactionList';
import { loadTransactions, saveTransactions, loadAccounts, saveAccounts, saveDeletedTransaction } from '../utils/storage';

export default function HomeScreen({ navigation, route }) {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));
  const [primaryBalance, setPrimaryBalance] = useState(0);

  useEffect(() => {
    loadInitialData();
    
    // Add focus listener to reload data when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      loadInitialData();
    });

    return () => unsubscribe();
  }, [navigation]);

  const loadInitialData = async () => {
    try {
      console.log('Loading initial data...');
      const savedAccounts = await loadAccounts();
      console.log('Loaded accounts:', savedAccounts);
      setAccounts(savedAccounts);

      const savedTransactions = await loadTransactions();
      console.log('Loaded transactions:', savedTransactions);
      setTransactions(savedTransactions);

      // Update primary balance
      const primary = savedAccounts.find(acc => acc.isPrimary);
      setPrimaryBalance(primary ? Number(primary.balance) : 0);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load data');
    }
  };

  // New effect: update primaryBalance whenever accounts change
  useEffect(() => {
    const primary = accounts.find(acc => acc.isPrimary);
    setPrimaryBalance(primary ? Number(primary.balance) : 0);
  }, [accounts]);

  const handleMenuPress = () => {
    // TODO: Implement menu functionality
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const handleTransaction = async (transaction) => {
    try {
      if (!transaction.amount || !transaction.description) {
        Alert.alert('Error', 'Please enter both amount and description');
        return;
      }

      if (!accounts || accounts.length === 0) {
        Alert.alert('Error', 'No accounts available');
        return;
      }

      // Find account by name
      const account = accounts.find(acc => 
        acc.name.toLowerCase() === transaction.accountName.toLowerCase()
      ) || accounts.find(acc => acc.isPrimary);

      // Create new transaction with proper date format
      const newTransaction = {
        ...transaction,
        date: new Date(currentDate).toISOString(),
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        accountId: account?.id,
        account: account?.name || 'Unknown'
      };

      // Merge with existing transactions
      const newTxList = [newTransaction, ...transactions];
      const savedTx = await saveTransactions(newTxList);
      
      if (!savedTx) {
        Alert.alert('Error', 'Failed to save transaction');
        return;
      }

      setTransactions(newTxList);

      // Update account balance
      const updatedAccounts = accounts.map(acc => {
        if (transaction.accountId === acc.id || (!transaction.accountId && acc.isPrimary)) {
          return { ...acc, balance: acc.balance - transaction.amount };
        }
        return acc;
      });

      await saveAccounts(updatedAccounts);
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error('Transaction error:', error);
      Alert.alert('Error', 'Failed to process transaction');
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      // Find the transaction to be deleted
      const transactionToDelete = transactions.find(t => t.id === transactionId);
      if (!transactionToDelete) return;

      // Save to deleted transactions
      await saveDeletedTransaction(transactionToDelete);

      // Remove from current transactions
      const newTransactions = transactions.filter(t => t.id !== transactionId);
      await saveTransactions(newTransactions);
      setTransactions(newTransactions);

      // Revert account balance
      const updatedAccounts = accounts.map(acc => {
        if (transactionToDelete.accountId === acc.id || (!transactionToDelete.accountId && acc.isPrimary)) {
          return { ...acc, balance: acc.balance + transactionToDelete.amount };
        }
        return acc;
      });
      await saveAccounts(updatedAccounts);
      setAccounts(updatedAccounts);

    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    const newTransactions = transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    await saveTransactions(newTransactions);
    setTransactions(newTransactions);
  };

  const totalSpend = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topSection}>
        <TopBar 
          primaryBalance={primaryBalance} 
          onMenuPress={handleMenuPress} 
          onSettingsPress={handleSettingsPress}
          onDateChange={handleDateChange}
          currentDate={currentDate}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.listContainer}>
          <TransactionList 
            transactions={transactions} 
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
            onSubmit={handleTransaction}
            accounts={accounts} // Pass accounts to TransactionList
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>Total: ₹{totalSpend.toFixed(2)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  topSection: {
    backgroundColor: '#000',
    zIndex: 1,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  listContainer: {
    flex: 1,
  },
  footer: {
    height: 30,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#333',
  },
  footerText: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingVertical: 3,
  },
  divider: {
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#333',
    marginBottom: 10,
  },
  footerDivider: {
    borderBottomWidth: 1,
    borderColor: '#000',
    marginBottom: 2,  // Further reduced margin
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontFamily: 'Courier',
    fontSize: 14,
    textAlign: 'center',
  },
  list: {
    flexGrow: 0,
    flexShrink: 1,
  },
});