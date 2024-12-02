import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '@/state/AuthContext';
import Button from '@/components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAttendance, registerAttendance } from '@/api/attendance.api';
import AppSidebar from '@/components/Sidebar';
import Dropdown from '@/components/Dropdown';
import { fetchAttendance } from '@/state/AuthReducer';

const NewAttendance = () => {
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeInPicker, setShowTimeInPicker] = useState(false);
  const [showTimeOutPicker, setShowTimeOutPicker] = useState(false);
  const [timeIn, setTimeIn] = useState(new Date());
  const [timeOut, setTimeOut] = useState(new Date());
  const [formData, setFormData] = useState({
    userId: '',
    date: '',
    timeIn: '',
    timeOut: '',
  });

  const { allUser, dispatch, attendance } = useAuth();
  const { user } = useAuth();
  const navigate: any = useNavigation();
  const item = useRoute();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  useEffect(() => {
    if (user.role === 'user') {
      setFormData({ ...formData, userId: user._id });
    }
  }, [user]);

  const { data } = useLocalSearchParams();

  console.log(formData);
  useEffect(() => {
    if (data) {
      const item = attendance.find((x) => x._id === data);

      if (item) {
        setFormData(item as any);
        const timeIn = item.timeIn ? new Date(`1970-01-01T${item.timeIn}:00Z`) : new Date(); // If empty, set to null
        setTimeIn(timeIn);
        const timeOut = item.timeOut ? new Date(`1970-01-01T${item.timeOut}:00Z`) : new Date(); // If empty, set to null
        setTimeOut(timeOut);
      }
    }
  }, [data]);

  // Helper function to format time in "HH:MM" format into a Date object

  const handleSubmit = async () => {
    const res = await registerAttendance({
      ...formData,
      date: date,
      timeIn: timeIn.toISOString(),
      timeOut: timeOut.toISOString(),
      status: 'pending',
    });

    setTimeout(async () => {
      const getAllLeaves = await getAttendance();
      dispatch(fetchAttendance({ attendance: getAllLeaves }));
      navigate.navigate('leave/index');
    }, 1500);
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined, timeType: 'in' | 'out') => {
    if (selectedTime) {
      if (timeType === 'in') {
        setTimeIn(selectedTime);
      } else {
        setTimeOut(selectedTime);
      }
    }
    if (timeType === 'in') {
      setShowTimeInPicker(false);
    } else {
      setShowTimeOutPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppSidebar />
      <Text style={styles.title}>New Attendance</Text>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(date)}
          mode='date'
          display='default'
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              setDate(selectedDate.toISOString().split('T')[0]);
            }
            setShowDatePicker(false);
          }}
        />
      )}

      {showTimeInPicker && (
        <DateTimePicker
          value={timeIn}
          mode='time'
          display='default'
          onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'in')}
        />
      )}

      {showTimeOutPicker && (
        <DateTimePicker
          value={timeOut}
          mode='time'
          display='default'
          onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'out')}
        />
      )}

      <View style={styles.form}>
        <View style={styles.dropdownContainer}>
          {/* Employee Name Dropdown */}
          <Dropdown
            label='Employee Name'
            value={formData.userId}
            isInputFilter={true}
            options={allUser
              ?.filter((x) => x.firstName)
              .map((x) => ({
                value: x._id,
                label: `${x.firstName} ${x.lastName}`,
              }))}
            id='user-id-dropdown'
            onChange={(e) => setFormData({ ...formData, userId: e as string })}
          />
        </View>

        {/* Date Picker */}
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{date}</Text>
          </TouchableOpacity>
        </View>

        {/* Time Inputs */}
        <View style={styles.timeInputs}>
          <View style={styles.timeInputContainer}>
            <Text style={styles.inputLabel}>Time In</Text>
            <TouchableOpacity onPress={() => setShowTimeInPicker(true)}>
              <Text style={styles.dateText}>
                {timeIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeInputContainer}>
            <Text style={styles.inputLabel}>Time Out</Text>
            <TouchableOpacity onPress={() => setShowTimeOutPicker(true)}>
              <Text style={styles.dateText}>
                {timeOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          text='Submit Attendance'
          onClick={handleSubmit}
          customStyle={{ marginTop: 30 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 100,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 18,
    width: '100%',
  },
  form: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    flexGrow: 1,
    height: 600,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dateContainer: {
    marginTop: 60,
    marginBottom: 20,
  },
  dateText: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 5,
  },
  timeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInputContainer: {
    width: '48%',
  },
  inputLabel: {
    marginBottom: 5,
    fontWeight: '600',
  },
});

export default NewAttendance;
