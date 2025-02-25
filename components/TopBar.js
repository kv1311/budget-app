import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Calendar from './Calendar';

export default function TopBar({ primaryBalance, onMenuPress, onSettingsPress }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const navigateDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.dateSection}>
          <TouchableOpacity onPress={() => navigateDate(-1)}>
            <Text style={styles.navButton}>{'<'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <Text style={styles.date}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigateDate(1)}>
            <Text style={styles.navButton}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.balance}>₹{primaryBalance.toFixed(2)}</Text>
        
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={onMenuPress}>
            <Ionicons name="menu" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSettingsPress}>
            <Ionicons name="settings-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <Calendar
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    justifyContent: 'space-between',
    height: 24,  // Fixed height to ensure alignment
  },
  date: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 14,
    lineHeight: 24,  // Match height for vertical centering
  },
  navButton: {
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 8,
    lineHeight: 24,  // Match height for vertical centering
    textAlignVertical: 'center',
  },
  balance: {
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: 16,
    fontWeight: '600',
    width: '35%',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    width: '25%',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: 15,
  },
});
