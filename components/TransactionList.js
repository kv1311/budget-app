import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, TextInput, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import TransactionInput from './TransactionInput';

export default function TransactionList({ transactions, onDelete, onEdit, onSubmit, accounts }) {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    console.log('Accounts in TransactionList:', accounts); // Debug log
  }, [accounts]);

  const renderRightActions = (transaction, dragX) => {
    const opacity = dragX.interpolate({
      inputRange: [-150, -100, 0],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.actionContainer, { opacity }]}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(transaction.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderLeftActions = (transaction, dragX) => {
    const opacity = dragX.interpolate({
      inputRange: [0, 100, 150],
      outputRange: [0, 1, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.actionContainer, { opacity }]}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(transaction)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleDelete = (transactionId) => {
    Alert.alert(
      "Delete Transaction",
      "This transaction will be moved to Recently Deleted",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(transactionId) },
      ]
    );
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setEditedDescription(transaction.description);
  };

  const handleSaveEdit = () => {
    const updatedTransaction = { ...editingTransaction, description: editedDescription };
    onEdit(updatedTransaction);
    setEditingTransaction(null);
    setEditedDescription('');
  };

  const renderFooter = () => (
    <View style={styles.inputContainer}>
      <TransactionInput 
        onSubmit={onSubmit}
        accounts={accounts} // Pass accounts to TransactionInput
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        data={transactions}
        keyExtractor={(item) => item.id || item.timestamp.toString()}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={(progress, dragX) => renderRightActions(item, dragX)}
            renderLeftActions={(progress, dragX) => renderLeftActions(item, dragX)}
            friction={2}
            threshold={200}
            activationDistance={150}
            overshootLeft={false}
            overshootRight={false}
            useNativeAnimations
          >
            <View style={styles.row}>
              {/* Amount */}
              <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>

              {/* Description and Category */}
              <View style={styles.descriptionWrapper}>
                {editingTransaction && editingTransaction.id === item.id ? (
                  <TextInput
                    style={styles.description}
                    value={editedDescription}
                    onChangeText={setEditedDescription}
                    onBlur={handleSaveEdit}
                    autoFocus
                  />
                ) : (
                  <>
                    <Text style={styles.description}>{item.description}</Text>
                    {item.category && (
                      <Text style={styles.tag}>#{item.category}</Text>
                    )}
                    {item.categories && item.categories.length > 0 && (
                      <View style={styles.categories}>
                        {item.categories.map((category, index) => (
                          <Text key={index} style={styles.category}>#{category}</Text>
                        ))}
                      </View>
                    )}
                  </>
                )}
              </View>

              {/* Account */}
              {item.account && (
                <Text style={styles.account} numberOfLines={1}>
                  @{item.account}
                </Text>
              )}
            </View>
          </Swipeable>
        )}
        ListFooterComponent={renderFooter}
        ListFooterComponentStyle={styles.footer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  amount: {
    width: '26%',
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 16,
    textAlign: 'right',
    paddingRight: 15,
  },
  descriptionWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  description: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
  },
  tag: {
    color: '#666',
    fontFamily: 'Courier',
    fontSize: 12,  // Decreased font size
    textAlign: 'left',
  },
  account: {
    color: '#888',
    fontFamily: 'Courier',
    fontSize: 14,
    textAlign: 'right',
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
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#000',
    minHeight: 100,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  category: {
    color: '#666',
    fontFamily: 'Courier',
    fontSize: 14,
  },
});
