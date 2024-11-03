import { Container } from '@/components/helpers/Container';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppSidebar from '@/components/Sidebar';
import { useAuth } from '@/state/AuthContext';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import Table from '@/components/Table';
import { CheckCircleIcon } from 'react-native-heroicons/outline';
import { formatDate } from '@/components/helpers/formatDateShift';
const index = () => {
  const headers = [
    {
      header: 'User ID',
      accessor: 'userId',
    },
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Date',
      accessor: 'date',
    },
    {
      header: 'Time In',
      accessor: 'timeIn',
    },
    {
      header: 'Time Out',
      accessor: 'timeOut',
    },
  ];

  const [isAttendance, setIsAttendance] = useState(false);
  const [startDate, setStartDate] = useState('2024-09-13');
  const [endDate, setEndDate] = useState('');
  const { allUser, attendance, shifts, dispatch } = useAuth();
  const [status, setStatus] = useState('all');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    const today = new Date();
    // const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    // setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const generateDateRange = (start: string | number | Date, end: string | number | Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray = [];

    for (let dt = startDate; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      dateArray.push(new Date(dt).toISOString().split('T')[0]);
    }
    return dateArray;
  };

  const convertTo12HourFormat = (timeString: string) => {
    if (!timeString) {
      return;
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;

    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  const [searchId, setSearchId] = useState('');

  const filteredData = () => {
    if (startDate && endDate) {
      const dateRange = generateDateRange(startDate, endDate);

      const userIdsInShifts = new Set(shifts.map((shift) => shift.userId));

      return allUser.flatMap((user) => {
        if (!userIdsInShifts.has(user._id)) {
          return [];
        }

        return dateRange.map((date) => {
          const formattedDate = new Date(date).toISOString().split('T')[0];

          const [year, month, day] = formattedDate.split('-');
          const formattedDate2 = `${month}-${day}-${year}`; // Result will be 10-29-2024

          const shiftRecord = shifts.find((record) => record.userId === user._id && record.date === formattedDate2);

          console.log(shiftRecord);

          // console.log(shifts);
          const attendanceRecord = attendance.find(
            (record) =>
              record.userId === user._id && new Date(record.date).toISOString().split('T')[0] === formattedDate
          );

          // if (attendanceRecord && !shiftRecord) {
          //   return null;
          // }

          if (!shiftRecord) {
            return null;
          }

          return {
            _id: attendanceRecord?._id,
            userId: user.userId,
            salaryIsPaid: attendanceRecord?.salaryIsPaid,
            name: `${user.firstName} ${user.lastName}`,
            date: formattedDate,
            timeIn: attendanceRecord
              ? attendanceRecord.timeIn === ''
                ? 'NOT CLOCKED IN'
                : convertTo12HourFormat(attendanceRecord.timeIn)
              : shiftRecord
              ? convertTo12HourFormat(shiftRecord.timeIn)
              : 'NOT CLOCKED IN',
            timeOut: attendanceRecord
              ? attendanceRecord.timeIn === ''
                ? 'NOT CLOCKED IN'
                : attendanceRecord.timeOut === ''
                ? 'ON DUTY'
                : convertTo12HourFormat(attendanceRecord.timeOut)
              : 'N/A',
            status: attendanceRecord && attendanceRecord.timeIn ? 'present' : attendanceRecord?.status,
          };
        });
      });
    }
    return [];
  };

  return (
    <View>
      <AppSidebar />
      <View style={Container as any}>
        <View style={styles.header}>
          <Text style={styles.title}>List of {isAttendance ? 'Attendance' : 'Salaries'}</Text>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.dateText}>{startDate}</Text>
            </TouchableOpacity>
            <Text style={styles.dateSeparator}>to</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.dateText}>{endDate}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.addButton}>
              <PlusIcon color='white' />
              <Text style={styles.buttonText}>Shift</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <View style={styles.dropdownContainer}>
            <Dropdown
              //   title='Attendance'
              label='Status'
              value={status}
              options={['All', 'Present', 'Absent', 'Late', 'Halfday', 'Leave'].map((x) => ({
                value: x.toLowerCase(),
                label: x.toUpperCase(),
              }))}
              id='status-dropdown'
              onChange={(e) => setStatus(e as string)}
            />

            {/* <TextInput
              style={styles.dateInput}
              value={startDate.toISOString().split('T')[0]} // Format date for input
              onChange={(e) => setStartDate(new Date(e.target.value))}
              onFocus={() => setShowStartDatePicker(true)}
            />
            <Text style={styles.dateSeparator}>to</Text>
            <TextInput
              style={styles.dateInput}
              value={endDate.toISOString().split('T')[0]} // Format date for input
              onChange={(e) => setEndDate(new Date(e.target.value))}
              onFocus={() => setShowEndDatePicker(true)}
            /> */}
          </View>

          <TouchableOpacity
            style={styles.button}
            //   onPress={() => nav.navigate('employee/new')}
          >
            <Text style={styles.buttonText}>Employee</Text>
            {/* <BiAddToQueue style={styles.buttonIcon} /> */}
          </TouchableOpacity>
        </View>
        {/* {showStartDatePicker && (
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
        )} */}

        <View style={styles.tabContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[styles.tab, !isAttendance && styles.activeTab]}
              onPress={() => setIsAttendance(false)}
            >
              Attendance
            </Text>
            <Text
              style={[styles.tab, isAttendance && styles.activeTab]}
              onPress={() => setIsAttendance(true)}
            >
              Salary
            </Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <Table
            itemsPerPage={12}
            handleBatch={
              isAttendance && (
                <div className='inline-flex hover:bg-gray ml-2'>
                  <span>
                    <CheckCircleIcon />
                  </span>
                  <span className='ml-2 '>Mark All Selected As Paid</span>
                </div>
              )
            }
            // submitSelected={(e) => handleSubmit(e)}
            handleSearch={(e) => setSearchId(e.target.value)}
            title='Attendance'
            isPay={isAttendance}
            data={filteredData()
              .filter((record) => status === 'all' || (record && record.status === status))
              ?.filter((x) => x?.userId?.toLowerCase().includes(searchId?.toLowerCase()))
              .filter((x) => shifts.find((y) => y.date === formatDate(new Date(x === null ? Date.now() : x.date))))
              ?.filter((x) => (isAttendance ? x !== null && x.status : x))}
            columns={headers as any}
            onEdit={(item) => console.log('first')}
            onRemove={function (): void {
              throw new Error('Function not implemented.');
            }}
            onViewPayment={(data) => {
              function removeAmPm(time: string): string {
                // Assuming time is in the format "hh:mm AM" or "hh:mm PM"
                return time.replace(/ AM| PM/, '');
              }

              const tI = data.timeIn;
              const tO = data.timeOut;
              // const handleSubmit = async () => {
              //   const res = await registerAttendance({
              //     ...data,
              //     salaryIsPaid: true,
              //     timeIn: tI === 'N/A' || tI === 'NOT CLOCKED IN' ? '00:00' : removeAmPm(data.timeIn),
              //     timeOut: tO === 'N/A' || tO === 'NOT CLOCKED IN' ? '00:00' : removeAmPm(data.timeOut),
              //     userId: allUser.find((x) => x.userId === data.userId)?._id,
              //   });

              //   if (res.success === false) return toast.error(res.data?.msg || 'Error');

              //   toast.success('Salary updated', {
              //     position: 'bottom-right',
              //   });
              //   dispatch({ type: 'ADD_ATTENDANCE', payload: res });
              // };

              // if (data.salaryIsPaid) {
              //   toast.error('Salary already marked as paid', {
              //     position: 'bottom-right',
              //   });
              // } else {
              //   handleSubmit();
              // }
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginRight: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },

  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10000,
    width: '50%',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 8,
    width: 100,
  },
  dateSeparator: {
    marginHorizontal: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 30,
    marginTop: 100,
  },
  tab: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    cursor: 'pointer',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff', // Your primary color
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingLeft: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    marginRight: 8,
  },
  buttonIcon: {
    color: '#fff',
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
});

export default index;
