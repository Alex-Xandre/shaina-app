import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppSidebar from '@/components/Sidebar';
import { useAuth } from '@/state/AuthContext';
import { PlusIcon } from 'react-native-heroicons/outline';
import { Container } from '@/components/helpers/Container';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Table from '@/components/Table';
import { convertTo12HourFormat } from '@/components/helpers/formatto12Hours';
import { fetchShifts } from '@/state/AuthReducer';
import { getTasks } from '@/api/tasks.api';

const headers = [
  { header: 'User ID', accessor: 'userId' },
  { header: 'Name', accessor: 'name' },
  { header: 'Date', accessor: 'date' },
  { header: 'Time In', accessor: 'timeIn' },
  { header: 'Time Out', accessor: 'timeOut' },
  { header: 'Work Hours', accessor: 'dutyHours' },
];
const Index = () => {
  const { shifts, allUser, dispatch } = useAuth();
  const [startDate, setStartDate] = useState(new Date(2024, 8, 1));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const getAllShift = await getTasks();

      dispatch(fetchShifts({ shift: getAllShift }));
    };
    getUsers();
  }, []);

  // useEffect(() => {
  //   const today = new Date();
  //   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  //   const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  //   setStartDate(startOfMonth);
  //   setEndDate(endOfMonth);
  // }, []);

  const filteredShifts = shifts
    .filter((shift) => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= startDate && shiftDate <= endDate;
    })
    //@ts-ignore
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const [searchId, setSearchId] = useState('');
  return (
    <View>
      <AppSidebar />
      <View style={Container as any}>
        <View style={styles.header}>
          <Text style={styles.title}>List of Shifts</Text>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <Text style={styles.dateSeparator}>to</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.dateText}>{endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton}>
              <PlusIcon color='white' />
              <Text style={styles.buttonText}>Shift</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Start Date Picker */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode='date'
            display='default'
            onChange={(event, date) => {
              if (event.type === 'set') {
                setStartDate(date || startDate);
              }
              setShowStartDatePicker(false);
            }}
          />
        )}

        {/* End Date Picker */}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode='date'
            display='default'
            onChange={(event, date) => {
              if (event.type === 'set') {
                setEndDate(date || endDate);
              }
              setShowEndDatePicker(false);
            }}
          />
        )}

        <View style={styles.tableContainer}>
          <Table
            itemsPerPage={12}
            title='Attendance'
            data={filteredShifts

              .map((x) => {
                const user = allUser.find((y) => y._id === x.userId);

                const hours = Math.floor(x.dutyHours / 60);
                const minutes = x.dutyHours % 60;

                return {
                  _id: x._id,
                  userId: user && user.userId,
                  name: user && `${user.firstName} ${user.lastName}`,
                  date: x.date,
                  timeIn: convertTo12HourFormat(x.timeIn),
                  timeOut: convertTo12HourFormat(x.timeOut),
                  dutyHours: `${hours}:${String(minutes).padStart(2, '0')} Hours`,
                };
              })
              ?.filter((x) => x?.userId?.toLowerCase().includes(searchId?.toLowerCase()))}
            handleSearch={(e) => setSearchId(e.target.value)}
            columns={headers as any}
            onEdit={(item) => console.log('first')}
            onRemove={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginTop: 100,
    marginRight: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginHorizontal: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default Index;
