import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/state/AuthContext';
import { getPay, getTasks } from '@/api/tasks.api';
import { fetchAttendance, fetchLeaves, fetchPay, fetchShifts, fetchUsers } from '@/state/AuthReducer';
import { getAttendance } from '@/api/attendance.api';
import { getAllUser } from '@/api/get.info.api';
import { getLeave } from '@/api/leave.api';
import { 
  BanknotesIcon, 
  UserIcon, 
  DocumentTextIcon, 
  FolderIcon, 
  Bars2Icon 
} from 'react-native-heroicons/outline'; // Importing the required icons

const HomeHR = () => {
  const { attendance, leave, shifts, allUser, dispatch, salary } = useAuth();
  const date = new Date();
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    const getDatas = async () => {
      const getPays = await getPay();
      dispatch(fetchPay({ salary: getPays }));
      const getAllShift = await getTasks();
      dispatch(fetchShifts({ shift: getAllShift }));
      const getAtt = await getAttendance();
      dispatch(fetchAttendance({ attendance: getAtt }));
      const getAllUsers = await getAllUser();
      dispatch(fetchUsers({ users: getAllUsers }));
      const getAllLeave = await getLeave();
      dispatch(fetchLeaves({ leave: getAllLeave }));
    };
    getDatas();
  }, []);



  function formatDateToDDMMYY(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  }

  function calculateTotalSalary(attendance: any, shifts: any) {
    let totalSalary: any = {};
    attendance.forEach((record: any) => {
      const userId = record.userId;
      const date = formatDateToDDMMYY(record.date);
      const shift = shifts.find((shift: any) => shift.userId === userId && shift.date === date);
      if (shift) {
        if (!totalSalary[userId]) {
          totalSalary[userId] = 0;
        }
        totalSalary[userId] += shift.dailyRate;
      }
    });
    return totalSalary;
  }

  const totalSalaries = calculateTotalSalary(attendance, shifts);
  const currentUnconfirmedLeaves = leave.filter((x) => !x.status).length;
  const previousMonthUnconfirmedLeaves = leave.filter(
    (x) => !x.status && new Date(x.date).getMonth() === date.getMonth() - 1
  ).length;
  const leavesChange =
    previousMonthUnconfirmedLeaves > 0
      ? ((currentUnconfirmedLeaves - previousMonthUnconfirmedLeaves) / previousMonthUnconfirmedLeaves) * 100
      : currentUnconfirmedLeaves > 0
      ? 100
      : 0;

  const todayShiftsCount = shifts.filter(
    (x) => x.date === `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
  ).length;

  const genderCount = { male: 0, female: 0, undefined: 0 };

  allUser.forEach((user: any) => {
    if (user.gender === 'male') genderCount.male++;
    else if (user.gender === 'female') genderCount.female++;
    else genderCount.undefined++;
  });

  const genderData = {
    labels: ['Male', 'Female', 'Undefined'],
    datasets: [
      {
        data: [genderCount.male, genderCount.female, genderCount.undefined],
        colors: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  const calculatePerformance = (userId: any) => {
    const userAttendance = attendance.filter((entry) => entry.userId === userId);
    const totalShifts = shifts.filter((shift) => shift.userId === userId).length;

    if (userAttendance.length === 0 || totalShifts === 0) {
      return 'N/A';
    }

    const totalWorkdays = new Set(shifts.map((shift) => shift.date)).size;
    const presentDays = userAttendance.filter((entry) => entry.status === 'present').length;
    const attendanceRate = totalWorkdays > 0 ? (presentDays / totalWorkdays) * 100 : 0;

    if (attendanceRate >= 80 && totalShifts >= 10) return 'Good';
    else if (attendanceRate >= 50) return 'Average';
    else return 'Bad';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        {/* Unconfirmed Leaves Box */}
        <View style={[styles.card, { borderLeftColor: '#FF6384' }]}>
          <View style={styles.cardContent}>
            <DocumentTextIcon size={24} color="#FF6384" />
            <Text style={styles.cardValue}>{currentUnconfirmedLeaves}</Text>
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>Unconfirmed Leaves</Text>
          </View>
        </View>

        {/* Today's Shifts Box */}
        <View style={[styles.card, { borderLeftColor: '#36A2EB' }]}>
          <View style={styles.cardContent}>
            <Bars2Icon size={24} color="#36A2EB" />
            <Text style={styles.cardValue}>{todayShiftsCount}</Text>
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>Today's Shifts</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        {/* Total Employees Box */}
        <View style={[styles.card, { borderLeftColor: '#FFCE56' }]}>
          <View style={styles.cardContent}>
            <UserIcon size={24} color="#FFCE56" />
            <Text style={styles.cardValue}>{allUser.filter((x: any) => x.status !== false).length}</Text>
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>Total Employees</Text>
          </View>
        </View>

        {/* Total Salary Box */}
        <View style={[styles.card, { borderLeftColor: '#4CAF50' }]}>
          <View style={styles.cardContent}>
            <BanknotesIcon size={24} color="#4CAF50" />
            <Text style={styles.cardValue}>{salary.reduce((sum, record) => sum + record.total, 0)}</Text>
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>Total Salaries Paid</Text>
          </View>
        </View>
      </View>

      {/* Gender Distribution */}
      <View style={styles.chartWrapper}>
        <Text style={styles.chartTitle}>Employee Gender Distribution</Text>
        <View style={styles.genderDetails}>
          <Text>Male: {genderCount.male}</Text>
          <Text>Female: {genderCount.female}</Text>
          <Text>Undefined: {genderCount.undefined}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
// Other unchanged parts of the code...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 0,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    width: '48%', // Ensures two cards fit per row
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderLeftWidth: 8, // Adds the left border with color
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  cardDetails: {
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 16,
    color: '#888',
  },
  changePositive: {
    fontSize: 14,
    color: 'green',
  },
  changeNegative: {
    fontSize: 14,
    color: 'red',
  },
  chartWrapper: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genderDetails: {
    marginTop: 15,
    alignItems: 'flex-start', // Align text to the left
  },
});

export default HomeHR;
