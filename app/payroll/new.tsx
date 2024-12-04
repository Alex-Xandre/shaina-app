import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // React Navigation for routing
import { useAuth } from '@/state/AuthContext';
import Dropdown from '@/components/Dropdown';
import AppSidebar from '@/components/Sidebar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { registerPay } from '@/api/tasks.api';
import Input from '@/components/Input';
import { addSalary } from '@/state/AuthReducer';

const NewSalary = () => {
  const navigation = useNavigation();
  const { allUser, shifts, attendance, salary, dispatch, user } = useAuth(); // assuming you are using context for this
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    _id: 'new',
    date: new Date().toISOString(),
    endDate: new Date().toISOString(),
    userId: '',
    status: true,
    pagibig: 0,
    philhealth: 0,
    insurance: 0,
    sss: 0,
    total: 0,
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  const handleChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const filteredShifts = shifts
    .filter((shift) => {
      const [month, day, year] = shift.date.split('-');
      const formattedDate = `${year}-${month}-${day}`;

      const shiftDate = normalizeDate(new Date(formattedDate));
      const normalizedStart = normalizeDate(new Date(startDate));
      const normalizedEnd = normalizeDate(new Date(endDate));

      return shiftDate >= normalizedStart && shiftDate <= normalizedEnd;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })

    .map((shift) => {
      const ratePerHour = shift.dailyRate > 0 ? shift.dailyRate : 125;

      const [month, day, year] = shift.date.split('-');
      const formattedDate = `${year}-${month}-${day}`;

      return {
        ...shift,
        date: formattedDate,
        ratePerHour: ratePerHour ? ratePerHour : 125,
      };
    })
    ?.filter((x) => x.userId === formData.userId);

  const dataAttendance =
    attendance
      ?.filter((x) => x.userId === formData.userId)
      .filter((shift) => {
        const shiftDate = normalizeDate(new Date(shift.date));
        const normalizedStart = normalizeDate(new Date(startDate));
        const normalizedEnd = normalizeDate(new Date(endDate));

        return shiftDate >= normalizedStart && shiftDate <= normalizedEnd;
      })
      ?.map((attend) => {
        return {
          ...attend,
          date: attend.date.toString().split('T')[0],
        };
      }) || [];

  const result = dataAttendance.map((att) => {
    // Find the shift that matches the attendance date
    const matchingShift = filteredShifts.find((shift) => shift.date === att.date);

    return {
      ...att,
      ratePerHour: matchingShift ? matchingShift.ratePerHour : 125,
    };
  });

  // Helper function to calculate total hours
  const calculateHours = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) return { totalHours: 0, range: '' };

    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);

    const inTime = inHours * 60 + inMinutes;
    const outTime = outHours * 60 + outMinutes;

    if (outTime <= inTime) return { totalHours: 0, range: '' };

    const totalMinutes = outTime < inTime ? 1440 - inTime + outTime : outTime - inTime;

    const totalHours = (totalMinutes / 60).toFixed(2);
    const range = `${timeIn} - ${timeOut}`;

    return { totalHours: Number(totalHours), range };
  };

  // Process attendance array
  const processedAttendance = result
    .map((item) => {
      const { timeIn, timeOut } = item;
      const { totalHours, range } = calculateHours(timeIn, timeOut);

      if (Number.isNaN(totalHours)) {
        return {
          ...item,
          totalHours: 0,
          timeRange: range,
        };
      }

      return {
        ...item,
        totalHours,
        timeRange: range,
      };
    })
    .filter((item) => item !== null)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  const calculateTotal = () => {
    return (
      processedAttendance.reduce((sum, record) => sum + record.totalHours * record.ratePerHour, 0) -
      formData.sss +
      formData.pagibig +
      formData.philhealth +
      formData.insurance
    );
  };

  const handleSubmit = async () => {
    const total = calculateTotal();
    const res = await registerPay({
      ...formData,
      total,
    });

    // dispatch({ type: 'ADD_SALARY', payload: { ...formData, total } });
    dispatch(addSalary(res));
    navigation.goBack();
  };

  const handlePrint = () => {
    const user = allUser.find((u) => u._id === formData.userId);
    const dataToPrint = {
      name: `${user?.firstName} ${user?.lastName}`,
      total: calculateTotal().toFixed(2),
      date: formData.date,
      endDate: formData.endDate,
    };
    Alert.alert('Print Payslip', JSON.stringify(dataToPrint));
  };

  return (
    <View style={styles.container}>
      <AppSidebar />

      <View style={styles.content}>
        <Text style={styles.title}>New Salary</Text>

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

        {user.role !== 'user' && (
          <View style={{ marginBottom: 10, marginTop: 20 }}>
            <Dropdown
              label='Employee Name'
              value={formData.userId}
              isInputFilter={true}
              options={allUser
                ?.filter((x) => x.firstName)
                .map((x) => {
                  return {
                    value: x._id,
                    label: x?.firstName + ' ' + x?.lastName,
                  };
                })}
              id='user-id-dropdown'
              onChange={(e) => {
                setFormData({ ...formData, userId: e as string });
              }}
            />
          </View>
        )}

        <View style={styles.datePickerContainer}>
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
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

        {/* <FlatList
  data={processedAttendance}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <View style={styles.tableRow}>
      <Text>{item.date}</Text>
      <Text>
        {item.timeIn} - {item.timeOut}
      </Text>
      <Text>₱ {item.ratePerHour}</Text>
      <Text>{item.totalHours}</Text>
      <Text>₱ {item.ratePerHour * item.totalHours}</Text>
    </View>
  )}
/> */}

        {processedAttendance.length > 0 && (
          <>
            <Text style={{ marginVertical: 10 }}>Deductions and Net Pay</Text>
            <Input
              style={styles.input}
              value={formData.philhealth.toString()}
              onChangeText={(text) => handleChange('philhealth', Number(text))}
              placeholder='Philhealth'
              keyboardType='numeric'
            />
            <Input
              style={styles.input}
              value={formData.sss.toString()}
              onChangeText={(text) => handleChange('sss', Number(text))}
              placeholder='SSS'
              keyboardType='numeric'
            />
            <Input
              style={styles.input}
              value={formData.insurance.toString()}
              onChangeText={(text) => handleChange('insurance', Number(text))}
              placeholder='Insurance'
              keyboardType='numeric'
            />
            <Input
              style={styles.input}
              value={formData.pagibig.toString()}
              onChangeText={(text) => handleChange('pagibig', Number(text))}
              placeholder='Pagibig'
              keyboardType='numeric'
            />

            <Text>
              Gross: ₱{' '}
              {processedAttendance.reduce((sum, record) => sum + record.totalHours * record.ratePerHour, 0).toFixed(2)}-
              Deductions: ₱ {(formData.insurance + formData.pagibig + formData.sss + formData.philhealth).toFixed(2)}
            </Text>

            <Text style={{ marginBottom: 10 }}>Net Pay: ₱ {calculateTotal().toFixed(2)}</Text>

            <Button
              title='Save Slip'
              onPress={handleSubmit}
            />
          </>
        )}
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  dateSeparator: {
    marginHorizontal: 4,
  },
});

export default NewSalary;
