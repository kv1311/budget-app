import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { parseTransaction } from '../utils/parseTransaction';

export default function TransactionInput({ onSubmit, accounts }) {
  const [input, setInput] = useState('');
  const [showAccounts, setShowAccounts] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      console.log('TransactionInput received accounts:', accounts);
    }
  }, [accounts]);

  const handleInputChange = (text) => {
    setInput(text);
    if (text.includes(':')) {
      const parts = text.split(':');
      const afterColon = parts[1];
      
      // Show all accounts if only ":" is typed
      if (afterColon === '') {
        setFilteredAccounts(accounts);
        setShowAccounts(true);
        return;
      }
      
      // Filter accounts if there's text after colon and no space
      if (!afterColon.startsWith(' ') && !afterColon.endsWith(' ')) {
        const query = afterColon.trim().toLowerCase();
        const filtered = accounts.filter(account => 
          account.name.toLowerCase().startsWith(query)
        );
        setFilteredAccounts(filtered);
        setShowAccounts(filtered.length > 0);
      } else {
        setShowAccounts(false);
      }
    } else {
      setShowAccounts(false);
    }
    inputRef.current?.focus();
  };

  const selectAccount = (accountName) => {
    let [beforePart, afterPart = ''] = input.split(':');
    const remainingText = afterPart.includes(' ') ? afterPart.split(' ').slice(1).join(' ') : '';
    
    const newInput = `${beforePart.trim()} :${accountName}${remainingText ? ' ' + remainingText : ''}`;
    setInput(newInput);
    setShowAccounts(false);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    const transaction = parseTransaction(input, accounts);
    if (transaction.amount && transaction.description) {
      onSubmit(transaction);
      setInput('');
      setShowAccounts(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={input}
        onChangeText={handleInputChange}
        onSubmitEditing={handleSubmit}
        placeholder="Amount, description, #category, :account"
        placeholderTextColor="#666"
        returnKeyType="done"
        autoCapitalize="none"
        blurOnSubmit={false}
      />
      
      {showAccounts && (
        <View style={styles.suggestions}>
          <FlatList
            data={filteredAccounts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectAccount(item.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>{item.name}</Text>
                <Text style={styles.suggestionBalance}>₹{item.balance.toFixed(2)}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            style={styles.suggestionsList}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  input: {
    height: 40,
    backgroundColor: 'transparent',
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 16,
    paddingHorizontal: 8, // Move padding to input instead
  },
  suggestions: {
    position: 'absolute',
    top: 56,
    left: 0, // Remove the gap
    right: 0, // Remove the gap
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    maxHeight: 150, // Allow more height for scrolling
    overflow: 'hidden', // Ensure content doesn't overflow
    zIndex: 1000, // Add this to ensure suggestions appear above other content
  },
  suggestionsList: {
    flexGrow: 0,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    height: 48, // Fixed height for each item
  },
  suggestionText: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
  },
  suggestionBalance: {
    color: '#666',
    fontFamily: 'Courier',
    fontSize: 14,
  }
});
