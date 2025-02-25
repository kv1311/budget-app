import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';

export default function Calendar({ visible, onClose, onSelectDate, selectedDate }) {
  const [displayDate, setDisplayDate] = React.useState(selectedDate || new Date());

  const getMonthDays = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const renderDays = () => {
    const { daysInMonth, firstDay } = getMonthDays();
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add empty spaces for first row alignment
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    // Add month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), i);
      const isDisabled = currentDate > today;
      const isSelected = 
        selectedDate?.getDate() === i && 
        selectedDate?.getMonth() === displayDate.getMonth() &&
        selectedDate?.getFullYear() === displayDate.getFullYear();
        
      days.push(
        <TouchableOpacity 
          key={i}
          style={[
            styles.dayCell, 
            isSelected && styles.selectedDay,
            isDisabled && styles.disabledDay
          ]}
          onPress={() => {
            if (!isDisabled) {
              onSelectDate(new Date(displayDate.getFullYear(), displayDate.getMonth(), i));
              onClose();
            }
          }}
          disabled={isDisabled}
        >
          <Text style={[
            styles.dayText, 
            isSelected && styles.selectedDayText,
            isDisabled && styles.disabledText
          ]}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.calendar}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1))}>
              <Text style={styles.navButton}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={() => setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1))}>
              <Text style={styles.navButton}>{'>'}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.weekdays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.weekdayText}>{day}</Text>
            ))}
          </View>
          
          <View style={styles.daysGrid}>
            {renderDays()}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthYear: {
    color: '#fff',
    fontFamily: 'Menlo',
    fontSize: 16,
    fontWeight: '600',
  },
  navButton: {
    color: '#fff',
    fontSize: 20,
    padding: 10,
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekdayText: {
    color: '#666',
    fontFamily: 'Menlo',
    fontSize: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: '#fff',
    fontFamily: 'Menlo',
    fontSize: 14,
  },
  selectedDay: {
    backgroundColor: '#ff3b30',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledText: {
    color: '#666',
  },
});
