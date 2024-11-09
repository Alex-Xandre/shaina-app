import AppSidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import DateTimePicker from '@react-native-community/datetimepicker';
import { LeaveType } from '@/types';
import { useAuth } from '@/state/AuthContext';
import { formatDate } from '@/components/helpers/formatDateShift';
import { getLeave, registerLeave } from '@/api/leave.api';
import { fetchLeaves } from '@/state/AuthReducer';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';

const NewLeave = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [formData, setFormData] = React.useState<LeaveType>({
    _id: 'text',
    leaveType: '',
    date: '',
    userId: '',
    status: false,
  });

  const { user, dispatch } = useAuth();
  useEffect(() => {
    if (user.role === 'user') {
      setFormData({ ...formData, userId: user._id });
    }
  }, [user]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);



const getDateRangeArray = (startDateStr:string, endDateStr:string) => {
    const dates = [];
    
    let startDate = new Date(startDateStr);
    let endDate = new Date(endDateStr);
  

    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }
  
    let currentDate = new Date(startDate); 
  
    while (currentDate <= endDate) {
      dates.push(formatDate(new Date(currentDate))); 
      currentDate.setDate(currentDate.getDate() + 1); 
    }
  
    return dates;
  };
  
  const navigate: any = useNavigation();


  const handleSubmit = async () => {
    const dateRangeArray = getDateRangeArray(startDate, endDate)

    const promises = dateRangeArray.map(async (item) => {
      return await registerLeave({
        ...formData,
        status: formData.status.toString() === 'Confirmed' ? true : false,
        date: item,
      });
    });

    // // const promisesAttendance = dateRangeArray.map(async (item) => {
    // //   return await registerAttendance({
    // //     _id: uuidv4(),
    // //     date: item,
    // //     timeIn: '00:00',
    // //     timeOut: '00:00',
    // //     userId: formData.userId,
    // //     status: 'leave',
    // //   });
    // // });

     await Promise.all(promises);
    // // await Promise.all(promisesAttendance);

    setTimeout(async () => {
      const getAllLeaves = await getLeave();
      dispatch(fetchLeaves({ leave: getAllLeaves }));
      navigate.navigate('leave/index');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <AppSidebar />
      <View style={styles.content}>
        <Text style={styles.title}> New Leave</Text>

        <View style={styles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <Text style={styles.dateText}>{startDate}</Text>
          </TouchableOpacity>
          <Text style={styles.dateSeparator}>to</Text>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <Text style={styles.dateText}>{endDate}</Text>
          </TouchableOpacity>
        </View>

        {showStartDatePicker && (
          <DateTimePicker
            value={new Date(startDate)}
            mode='date'
            display='default'
            onChange={(event, date) => {
              if (event.type === 'set') {
                setStartDate((date && date.toISOString().split('T')[0]) as string);
              }
              setShowStartDatePicker(false);
            }}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date(endDate)}
            mode='date'
            display='default'
            onChange={(event, date) => {
              if (event.type === 'set') {
                setEndDate((date && date.toISOString().split('T')[0]) as string);
              }
              setShowEndDatePicker(false);
            }}
          />
        )}
        <View style={styles.form}>
          <View style={{ width: '100%', position: 'relative', zIndex: 10000 }}>
            <Dropdown
              label='Leave Type'
              disabled={formData.status === true}
              value={formData.leaveType}
              options={[
                'Service Incentive Leave (SIL)',
                'Maternity Leave',
                'Paternity Leave',
                'Parental Leave',
                'Sick Leave',
              ].map((x) => {
                return {
                  value: x,
                  label: x.toUpperCase(),
                };
              })}
              onChange={(e) => setFormData({ ...formData, leaveType: e as string })}
            />
          </View>
          <Button
            text='Submit Leave Request'
            onClick={handleSubmit}
            customStyle={{ marginTop: user.role === 'user' && 100 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 18,
    width: '100%',
  },
  content: {
    height: '90%',
    margin: 0,
    paddingHorizontal: 10,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
  },
  chevron: {
    marginHorizontal: 8,
  },
  headerSubText: {
    opacity: 0.7,
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    opacity: 0.7,
  },
  hiddenInput: {
    display: 'none',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 8,
  },
  note: {
    fontSize: 12,
    marginVertical: 16,
    color: '#666',
    marginTop: 100,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
    gap: 12,
  },
  dateText: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dateSeparator: {
    marginHorizontal: 4,
  },
});

export default NewLeave;
