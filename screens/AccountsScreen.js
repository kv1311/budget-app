import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, TextInput, FlatList, Keyboard, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { loadAccounts, saveAccounts } from '../utils/storage';

export default function AccountsScreen({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setShowKeyboardHint(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setShowKeyboardHint(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const savedAccounts = await loadAccounts();
    if (savedAccounts && savedAccounts.length > 0) {
      setAccounts(savedAccounts);
    } else {
      // Set default accounts only if no saved accounts exist
      const defaultAccounts = [
        { id: '1', name: 'Cash', balance: 0, isEditing: false, isPrimary: true },
        { id: '2', name: 'Bank', balance: 0, isEditing: false, isPrimary: false }
      ];
      await saveAccounts(defaultAccounts);
      setAccounts(defaultAccounts);
    }
  };

  const toggleEditing = async (id) => {
    setAccounts(prev => {
      const newAccounts = prev.map(acc => ({
        ...acc,
        isEditing: acc.id === id ? !acc.isEditing : false
      }));
      saveAccounts(newAccounts); // Save after update
      return newAccounts;
    });
  };

  const updateAccount = async (id, field, value) => {
    setAccounts(prev => {
      const newAccounts = prev.map(acc => {
        if (acc.id === id) {
          return {
            ...acc,
            [field]: field === 'balance' ? parseFloat(value) || 0 : value
          };
        }
        return acc;
      });
      saveAccounts(newAccounts); // Save after update
      return newAccounts;
    });
  };

  const addAccount = async () => {
    if (newAccountName.trim()) {
      setAccounts(prev => {
        const newAccounts = [...prev, {
          id: Date.now().toString(),
          name: newAccountName.trim(),
          balance: parseFloat(newAccountBalance) || 0,
          isEditing: false,
          isPrimary: prev.length === 0
        }];
        saveAccounts(newAccounts); // Save after update
        return newAccounts;
      });
      setNewAccountName('');
      setNewAccountBalance('');
      setShowAdd(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete this account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          const newAccounts = accounts.filter(acc => acc.id !== id);
          await saveAccounts(newAccounts);
          setAccounts(newAccounts);
        }},
      ]
    );
  };

  const renderAccount = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => {
        const opacity = dragX.interpolate({
          inputRange: [-150, -100, 0],
          outputRange: [1, 1, 0],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View style={[styles.actionContainer, { opacity }]}>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
      renderLeftActions={(progress, dragX) => {
        const opacity = dragX.interpolate({
          inputRange: [0, 100, 150],
          outputRange: [0, 1, 1],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View style={[styles.actionContainer, { opacity }]}>
            <TouchableOpacity style={styles.editButton} onPress={() => toggleEditing(item.id)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
    >
      <View style={styles.accountItem}>
        <View style={styles.accountInfo}>
          {item.isEditing ? (
            <>
              <TextInput
                style={styles.editInput}
                value={item.name}
                onChangeText={(text) => updateAccount(item.id, 'name', text)}
                autoFocus
              />
              <TextInput
                style={styles.editInput}
                value={item.balance.toString()}
                onChangeText={(text) => updateAccount(item.id, 'balance', text)}
                keyboardType="numeric"
              />
            </>
          ) : (
            <TouchableOpacity 
              style={styles.accountDisplay}
              onLongPress={() => toggleEditing(item.id)}
            >
              <View style={styles.accountNameContainer}>
                <Text style={styles.accountName}>{item.name}</Text>
                {item.isPrimary && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryBadgeText}>Primary</Text>
                  </View>
                )}
              </View>
              <Text style={styles.accountBalance}>₹{item.balance.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          onPress={item.isEditing ? () => toggleEditing(item.id) : () => setPrimaryAccount(item.id)}
        >
          <Ionicons 
            name={item.isEditing ? "checkmark" : (item.isPrimary ? "star" : "star-outline")} 
            size={20} 
            color={item.isPrimary ? "#FFD700" : "#666"} 
          />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  const setPrimaryAccount = async (id) => {
    setAccounts(prev => {
      const newAccounts = prev.map(acc => ({
        ...acc,
        isPrimary: acc.id === id
      }));
      saveAccounts(newAccounts); // Save after update
      return newAccounts;
    });
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
        <Text style={styles.title}>Accounts</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAdd(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={styles.addSection}>
          <TextInput
            style={styles.input}
            value={newAccountName}
            onChangeText={setNewAccountName}
            placeholder="Account name"
            placeholderTextColor="#666"
            autoFocus={true}
          />
          <TextInput
            style={styles.input}
            value={newAccountBalance}
            onChangeText={setNewAccountBalance}
            placeholder="Initial balance"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={addAccount}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      {(showKeyboardHint || accounts.some(acc => acc.isEditing)) && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Long press to edit • Swipe to delete • Tap checkmark to save
          </Text>
        </View>
      )}
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
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Courier',
  },
  addButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  addSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#000', // Changed from #111 to match rest of the app
  },
  input: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
    padding: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    outlineStyle: 'none', // Remove focus highlight
  },
  saveButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#0a84ff',
    fontFamily: 'Courier',
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  accountInfo: {
    flex: 1,
  },
  accountDisplay: {
    flex: 1,
  },
  editInput: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
    padding: 4,
    marginVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    outlineStyle: 'none', // Remove focus highlight
  },
  accountName: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 16,
  },
  accountBalance: {
    color: '#666',
    fontFamily: 'Courier',
    fontSize: 14,
    marginTop: 4,
  },
  hint: {
    padding: 8,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  hintText: {
    color: '#666',
    fontFamily: 'Courier',
    fontSize: 12,
    textAlign: 'center',
  },
  accountNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  primaryBadgeText: {
    color: '#000',
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  editButtonText: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
  },
});
