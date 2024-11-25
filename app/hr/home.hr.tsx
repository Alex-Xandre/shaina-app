import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import { BsClockFill, BsGraphDownArrow, BsGraphUpArrow, BsPeopleFill } from 'react-icons/bs';
// import { FaPeopleGroup } from 'react-icons/fa6';
// import { RiFileUploadFill } from 'react-icons/ri';
// import { BiDollarCircle } from 'react-icons/bi';
import { useAuth } from '@/state/AuthContext';


const HomeHR = () => {
  const { attendance, leave, shifts, allUser } = useAuth();
  const date = new Date();
  const [searchId, setSearchId] = useState('');

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
  // const totalValue = Object.keys(totalSalaries).length > 0 ? Object.values(totalSalaries).reduce((sum: number, value: number) => sum + value, 0) : 0;

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

  const todayShiftsCount = shifts && shifts.filter(
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
      {/* Unconfirmed Leaves Box */}
      <View style={styles.card}>
        <Text style={styles.cardValue}>{currentUnconfirmedLeaves}</Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>Unconfirmed Leaves</Text>
          <Text style={leavesChange >= 0 ? styles.changePositive : styles.changeNegative}>
            {leavesChange.toFixed(2)}%
            {/* {leavesChange >= 0 ? <BsGraphUpArrow /> : <BsGraphDownArrow />} */}
          </Text>
        </View>
        {/* <RiFileUploadFill /> */}
      </View>

      {/* Officers Today Box */}
      <View style={styles.card}>
        <Text style={styles.cardValue}>{todayShiftsCount}</Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>Today's Shifts</Text>
          <Text style={styles.changePositive}> {/* Assuming this is always positive */}
            {leavesChange.toFixed(2)}%
            {/* <BsGraphUpArrow /> */}
          </Text>
        </View>
        {/* <BsPeopleFill /> */}
      </View>

      {/* Total Employees Box */}
      <View style={styles.card}>
        <Text style={styles.cardValue}>{allUser.length}</Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>Total Employees</Text>
          <Text style={styles.changePositive}>
            {leavesChange.toFixed(2)}%
            {/* <BsGraphUpArrow /> */}
          </Text>
        </View>
        {/* <FaPeopleGroup /> */}
      </View>

      {/* Employee Structure Chart */}
      <View style={styles.chartWrapper}>
        {/* {Object.keys(genderData.datasets).length > 0 && <PieChart
          data={genderData.datasets}
          width={300}
          height={300}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />} */}
        <View style={styles.genderDetails}>
          <Text>Male: {genderCount.male}</Text>
          <Text>Female: {genderCount.female}</Text>
          <Text>Undefined: {genderCount.undefined}</Text>
        </View>
      </View>

      {/* Total Salary Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Salaries Paid</Text>
        {/* <Text style={styles.changePositive}>₱{totalValue}</Text>
        <BiDollarCircle /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e2e2e',
  },
  cardDetails: {
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
  },
  changePositive: {
    fontSize: 12,
    color: 'green',
  },
  changeNegative: {
    fontSize: 12,
    color: 'red',
  },
  chartWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  genderDetails: {
    marginTop: 15,
    alignItems: 'center',
  },
});

export default HomeHR;
