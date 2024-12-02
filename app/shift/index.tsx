import { getTasks } from '@/api/tasks.api';
import Button from '@/components/Button';
import AppSidebar from '@/components/Sidebar';
import { useAuth } from '@/state/AuthContext';
import { fetchShifts } from '@/state/AuthReducer';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Card from './Card';
import Table from '@/components/Table';
import { convertTo12HourFormat } from '@/components/helpers/formatto12Hours';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ShiftType } from '@/types';
const headers = [
  { header: 'User ID', accessor: 'userId' },
  { header: 'Name', accessor: 'name' },
  { header: 'Date', accessor: 'date' },
  { header: 'Time In', accessor: 'timeIn' },
  { header: 'Time Out', accessor: 'timeOut' },
  { header: 'Work Hours', accessor: 'dutyHours' },
];

const Index = () => {
  const nav: any = useNavigation();
  const { user, dispatch, shifts, allUser } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setStartDate(startOfMonth.toISOString().split('T')[0]);
    setEndDate(endOfMonth.toISOString().split('T')[0]);
  }, []);

  //get shiffts
  useEffect(() => {
    const getUsers = async () => {
      const getAllShift = await getTasks();

      dispatch(fetchShifts({ shift: getAllShift }));
    };
    getUsers();
  }, []);

  const filteredShifts = shifts
    .filter((shift) => {
      const [month, day, year] = shift.date.split('-').map(Number);
      const shiftDate = new Date(year, month - 1, day);

      const start = new Date(startDate);
      const end = new Date(endDate);

      return shiftDate >= start && shiftDate <= end;
    })
    .sort((a, b) => {
      // Convert both dates to YYYY-MM-DD format
      const [monthA, dayA, yearA] = a.date.split('-').map(Number);
      const [monthB, dayB, yearB] = b.date.split('-').map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateA.getTime() - dateB.getTime();
    });

  // console.log(filteredShifts,"helo", shifts)

  const [searchId, setSearchId] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  return (
    <View style={styles.container}>
      <AppSidebar />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>List of Shifts</Text>
          {user.role !== 'user' && (
            <Button
              text='Shift'
              onClick={() => nav.navigate('shift/new')}
              customStyle={{ paddingRight: 15 }}
            />
          )}
        </View>

        <View
          style={{
            alignItems: 'center',
            display: 'flex',
            width: '100%',
            paddingRight: 10,
            justifyContent: 'space-between',
            zIndex: 1000,
          }}
        >
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              style={{ marginTop: 30 }}
            >
              <Text style={styles.dateText}>{startDate}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowEndDatePicker(true)}
              style={{ marginTop: 30 }}
            >
              <Text style={styles.dateText}>{endDate}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.addButton}>
              <PlusIcon color='white' />
              <Text style={styles.buttonText}>Shift</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {showStartDatePicker && (
          <DateTimePicker
            value={new Date(startDate)}
            mode='date'
            display='default'
            onChange={(event, date) => {
              if (event.type === 'set') {
                setStartDate((date && date.toISOString().split('T')[0]) || startDate);
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
                setEndDate((date && date.toISOString().split('T')[0]) || endDate);
              }
              setShowEndDatePicker(false);
            }}
          />
        )}

        {user.role === 'user' ? (
          <ScrollView
            style={{ paddingRight: 10, flex: 1, backgroundColor: '#fff' }}
            showsVerticalScrollIndicator={false}
          >
            {shifts.length === 0 ? (
              <Text>Attendance List Empty</Text>
            ) : (
              shifts.map((x) => {
                return <Card data={x} />;
              })
            )}
          </ScrollView>
        ) : (
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
            handleSearch={(e) => setSearchId(e)}
            columns={headers as any}
            onEdit={(item: ShiftType) => {
              nav.navigate('shift/new', { data: item._id });
            }}
            onRemove={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  tableContainer: {
    marginTop: 20,
    marginRight: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 18,
    width: '100%',
  },
  content: {
    height: '90%',
    paddingLeft: 15,
    margin: 0,
    position: 'relative',
    paddingRight: 10,
    marginTop: 100,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingRight: 10,
  },
  headerText: {
    fontWeight: '800',
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default Index;
