import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@budget_data';
const ACCOUNTS_KEY = '@budget_accounts';
const DELETED_KEY = '@deleted_transactions';
const TRANSACTIONS_KEY = '@transactions';

export const saveTransactions = async (transactions) => {
  try {
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    console.log('Saved transactions:', transactions);
    return true;
  } catch (error) {
    console.error('Save transactions error:', error);
    return false;
  }
};

export const loadTransactions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    const transactions = jsonValue != null ? JSON.parse(jsonValue) : [];
    console.log('Loaded transactions:', transactions);
    return transactions;
  } catch (error) {
    console.error('Load transactions error:', error);
    return [];
  }
};

export const saveAccounts = async (accounts) => {
  try {
    const jsonValue = JSON.stringify(accounts);
    await AsyncStorage.setItem(ACCOUNTS_KEY, jsonValue);
    console.log('Saved accounts:', accounts);
    return true;
  } catch (error) {
    console.error('Save accounts error:', error);
    return false;
  }
};

export const loadAccounts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(ACCOUNTS_KEY);
    const accounts = jsonValue != null ? JSON.parse(jsonValue) : [];
    console.log('Loaded accounts:', accounts);
    if (accounts.length === 0) {
      // Set default accounts if none exist
      const defaultAccounts = [
        { id: '1', name: 'Cash', balance: 0, isEditing: false, isPrimary: true },
        { id: '2', name: 'Bank', balance: 0, isEditing: false, isPrimary: false }
      ];
      await saveAccounts(defaultAccounts);
      return defaultAccounts;
    }
    return accounts;
  } catch (error) {
    console.error('Load accounts error:', error);
    return [];
  }
};

export const loadTransactionsForDate = async (date) => {
  try {
    const dateKey = date.toISOString().split('T')[0];
    const monthKey = dateKey.substring(0, 7);
    const allTransactions = await loadAllTransactions();
    return (allTransactions[monthKey]?.[dateKey] || []);
  } catch (error) {
    console.error('Load error:', error);
    return [];
  }
};

export const loadTransactionsForMonth = async (date) => {
  try {
    const monthKey = date.toISOString().split('T')[0].substring(0, 7);
    const allTransactions = await loadAllTransactions();
    return allTransactions[monthKey] || {};
  } catch (error) {
    console.error('Load error:', error);
    return {};
  }
};

export const loadAllTransactionsList = async () => {
  try {
    const allTransactions = await loadAllTransactions();
    let flatList = [];
    
    // Convert nested structure to flat list
    Object.values(allTransactions).forEach(months => {
      Object.values(months).forEach(dates => {
        flatList = [...flatList, ...dates];
      });
    });
    
    // Sort by date and time, newest first
    return flatList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Load error:', error);
    return [];
  }
};

export const loadAllTransactions = async () => {
  try {
    const transactions = await AsyncStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : {};
  } catch (error) {
    console.error('Load error:', error);
    return {};
  }
};

export const saveDeletedTransaction = async (transaction) => {
  try {
    const deleted = await loadDeletedTransactions();
    const updatedDeleted = [
      {
        ...transaction,
        deletedAt: new Date().toISOString()
      }, 
      ...deleted
    ];
    await AsyncStorage.setItem(DELETED_KEY, JSON.stringify(updatedDeleted));
    return true;
  } catch (e) {
    console.error('Error saving deleted transaction:', e);
    return false;
  }
};

export const loadDeletedTransactions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(DELETED_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading deleted transactions:', e);
    return [];
  }
};

export const restoreTransaction = async (transaction) => {
  const [transactions, deleted] = await Promise.all([
    loadAllTransactions(),
    loadDeletedTransactions(),
  ]);
  
  const updatedDeleted = deleted.filter(t => t.id !== transaction.id);
  const updatedTransactions = [transaction, ...transactions];
  
  await Promise.all([
    AsyncStorage.setItem(DELETED_KEY, JSON.stringify(updatedDeleted)),
    saveTransactions(updatedTransactions)
  ]);
};

export const clearDeletedTransactions = async () => {
  try {
    await AsyncStorage.removeItem(DELETED_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing deleted transactions:', e);
    return false;
  }
};

export const exportToCSV = (transactions) => {
  const headers = 'Date,Amount,Category,Description\n';
  const rows = transactions.map(t => 
    `${t.date},${t.amount},${t.category},"${t.description}"`
  ).join('\n');
  return headers + rows;
};
