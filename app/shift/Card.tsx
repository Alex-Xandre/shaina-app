import { registerTasks } from '@/api/tasks.api';
import { useAuth } from '@/state/AuthContext';
import { addShift } from '@/state/AuthReducer';
import { LeaveType, ShiftType } from '@/types';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ClockIcon } from 'react-native-heroicons/outline';

const Card = ({ data }: { data: ShiftType }) => {
  const { date, timeIn, timeOut, task, shiftStatus } = data;

  const { dispatch } = useAuth();
  // vbtn style
  const getButtonStyle = () => {
    switch (shiftStatus) {
      case 'started':
        return { backgroundColor: '#ff9800', label: 'Ongoing', color: '#fff' };
      case 'completed':
        return { backgroundColor: '#4caf50', label: 'Completed', color: '#fff' };
      default:
        return { backgroundColor: '#2196f3', label: 'Start', color: '#fff' }; // Blue for starting
    }
  };

  const { backgroundColor, label, color } = getButtonStyle();

  const handleSubmit = async () => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    if (!data) return;

    const updatedAttendanceData = {
      ...data,
      shiftStatus: (!shiftStatus || shiftStatus === 'pending' || shiftStatus ==="" ) ? 'started' : shiftStatus === 'started' ? "completed":"completed" ,
    };

    console.log(shiftStatus);
    const res = await registerTasks(updatedAttendanceData);

    if (res.success === false) return;
    dispatch(addShift(res));
  };

  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <Text style={styles.taskText}>{task || 'No Task Assigned'}</Text>

        <View style={styles.timeContainer}>
          <ClockIcon
            size={20}
            color='#555'
          />
          <Text style={styles.timeText}>{timeIn && timeOut ? `${timeIn} - ${timeOut}` : 'No time assigned'}</Text>
        </View>
      </View>

      <Text style={styles.dateText}>{`Deadline: ${date}`}</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor }]}
        onPress={handleSubmit}
      >
        <Text style={[styles.buttonText, { color }]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 0,
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#555',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Card;
