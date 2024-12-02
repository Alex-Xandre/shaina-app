import AppSidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getLeave, registerLeave } from '@/api/leave.api';
import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import { useAuth } from '@/state/AuthContext';
import { fetchLeaves } from '@/state/AuthReducer';
import { LeaveType } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const NewLeave = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { allUser } = useAuth()

  const [formData, setFormData] = React.useState<LeaveType>({
    _id: 'text',
    leaveType: '',
    date: '',
    userId: '',
    status: false,
    endDate: '',
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

  const item = useRoute()

  console.log(item)

  const navigate: any = useNavigation();

  const handleSubmit = async () => {
    await registerLeave({
      ...formData,
      status: formData.status.toString() === 'Confirmed' ? true : false,
      date: startDate,
      endDate: endDate,
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

    // await Promise.all(promises);
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
          <View style={{ width: '100%', position: 'relative', zIndex: 10000, marginTop: -50 }}>


            {user.role !== "user" &&
              <View style={{ marginBottom: 10, marginTop: 50, }}>
                <Dropdown

                  label='Employee Name'
                  value={formData.userId}
                  isInputFilter={true}

                  options={allUser?.filter((x) => x.firstName).map((x) => {
                    return {
                      value: x._id,
                      label: x?.firstName + ' ' + x?.lastName,
                    };
                  })}
                  id='user-id-dropdown'

                  onChange={(e) => {
                    setFormData({ ...formData, userId: e as string });
                  }}
                /></View>

            }
            <View style={styles.datePickerContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 1000,
                  flex: 1,
                }}
              >
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


              <View style={{ flexDirection: "row", marginTop: 42 }}>
                <TouchableOpacity
                  onPress={() => setShowStartDatePicker(true)}
                  style={{ marginTop: 60 }}
                >
                  <Text style={styles.dateText}>{startDate}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  style={{ marginTop: 60, marginLeft: 10 }}
                >
                  <Text style={styles.dateText}>{endDate}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Button
            text='Submit Leave Request'
            onClick={handleSubmit}
            customStyle={{ marginTop: user.role === 'user' ? 100 : 30 }}
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
    marginTop: 100,
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
    gap: 12,
  },
  dateText: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 5,
  },
  dateSeparator: {
    marginHorizontal: 4,
  },
});

export default NewLeave;