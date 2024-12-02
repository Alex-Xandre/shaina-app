import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Dropdown from '@/components/Dropdown'; // Assuming your Dropdown component
import Button from '@/components/Button';
import { useAuth } from '@/state/AuthContext';
import AppSidebar from '@/components/Sidebar';
import Input from '@/components/Input';
import { formatDate } from '@/components/helpers/formatDateShift';
import { getTasks, registerTasks } from '@/api/tasks.api';
import { fetchShifts } from '@/state/AuthReducer';

const NewTask = () => {
  const navigate: any = useNavigation();
  const { allUser, dispatch } = useAuth(); // Assuming user data is in context

  const [formData, setFormData] = useState({
    timeIn: '',
    timeOut: '',
    dutyHours: 0,
    task: '',
    userId: '',
    off: [],
    dailyRate: 0,
    date: '',
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimeInPicker, setShowTimeInPicker] = useState(false);
  const [showTimeOutPicker, setShowTimeOutPicker] = useState(false);

  useEffect(() => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
  }, []);

  const handleDateChange = (event: any, selectedDate: Date | undefined, type: string) => {
    const currentDate = selectedDate || new Date();
    if (type === 'start') {
      setStartDate(currentDate);
      setShowStartDatePicker(false);
    } else {
      setEndDate(currentDate);
      setShowEndDatePicker(false);
    }
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined, type: string) => {
    const currentTime = selectedTime || new Date();
    if (type === 'timeIn') {
      setFormData({ ...formData, timeIn: currentTime.toLocaleTimeString() });
      setShowTimeInPicker(false);
    } else {
      setFormData({ ...formData, timeOut: currentTime.toLocaleTimeString() });
      setShowTimeOutPicker(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getDateRangeArray = (startDate: string, endDate: string) => {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(formatDate(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handleSubmit = async () => {
    const dateRangeArray = getDateRangeArray(formatDate(new Date(startDate)), formatDate(new Date(endDate)));
    console.log(dateRangeArray);

    const promises = dateRangeArray.map(async (item) => {
      return await registerTasks({
        ...formData,
        date: item,
        dailyRate: Number(formData.dailyRate),
        dutyHours: Number(formData.dutyHours),
      });
    });

    await Promise.all(promises);

    console.log(promises);
    setTimeout(async () => {
      const getAllLeaves = await getTasks();
      dispatch(fetchShifts({ shift: getAllLeaves }));
      navigate.navigate('leave/index');
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppSidebar />
      <Text style={styles.title}> New Task</Text>
      <View style={{ paddingHorizontal: 10 }}>
        {/* User ID Dropdown */}
        <View style={styles.dropdownContainer}>
          <Dropdown
            label='Employee Name'
            value={formData.userId}
            isInputFilter={true}
            options={allUser
              ?.filter((x) => x.firstName)
              .map((x) => ({
                value: x._id,
                label: `${x?.firstName} ${x?.lastName}`,
              }))}
            id='user-id-dropdown'
            onChange={(e) => setFormData({ ...formData, userId: e as string })}
          />
        </View>

        {/* Start Date Picker */}
        <View style={{ ...styles.inputContainer, marginTop: 50 }}>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <Text style={styles.inputLabel}>Start Date</Text>
            <Text style={styles.input}>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode='date'
              display='default'
              onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'start')}
            />
          )}
        </View>

        {/* End Date Picker */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <Text style={styles.inputLabel}>End Date</Text>
            <Text style={styles.input}>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode='date'
              display='default'
              onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'end')}
            />
          )}
        </View>

        {/* Time In */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowTimeInPicker(true)}>
            <Text style={styles.inputLabel}>Start Time</Text>
            <Text style={styles.input}>{formData.timeIn || 'Select Time'}</Text>
          </TouchableOpacity>
          {showTimeInPicker && (
            <DateTimePicker
              value={new Date()}
              mode='time'
              display='default'
              onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'timeIn')}
            />
          )}
        </View>

        {/* Time Out */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowTimeOutPicker(true)}>
            <Text style={styles.inputLabel}>End Time</Text>
            <Text style={styles.input}>{formData.timeOut || 'Select Time'}</Text>
          </TouchableOpacity>
          {showTimeOutPicker && (
            <DateTimePicker
              value={new Date()}
              mode='time'
              display='default'
              onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'timeOut')}
            />
          )}
        </View>

        {/* Duty Hours Input */}
        <View style={styles.inputContainer}>
          <Input
            style={styles.input}
            label='Duty Hours'
            placeholder='Enter duty hours'
            value={formData.dutyHours.toString()}
            onChangeText={(text) => handleChange('dutyHours', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            style={styles.input}
            label='Hourly rate'
            placeholder='Enter Hourly Rate'
            value={formData.dailyRate.toString()}
            onChangeText={(text) => handleChange('dailyRate', text)}
          />
        </View>
        {/* Submit Button */}
        <Button
          text='Submit Task'
          onClick={handleSubmit}
          customStyle={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginTop: 100,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginVertical: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {},
  dropdownContainer: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default NewTask;
