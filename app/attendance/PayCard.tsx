import { SalaryType } from '@/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PayCard = ({ data }: { data: SalaryType }) => {
  const { date, endDate, status, pagibig, philhealth, insurance, sss, total } = data;

  if (!date) {
    return null;
  }

  // Format the date to display
  const formattedDate = new Date(date);
  const formattedDateString = `${formattedDate.toLocaleString('default', {
    month: 'long',
  })} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`;

  const formattedEndDate = new Date(endDate);
  const formattedEndDateString = `${formattedEndDate.toLocaleString('default', {
    month: 'long',
  })} ${formattedEndDate.getDate()}, ${formattedEndDate.getFullYear()}`;

  // Determine the salary status color
  const statusStyles = getStatusStyle(status);

  return (
    <View style={styles.card}>
      <Text style={styles.date}>
        {formattedDateString} - {formattedEndDateString}
      </Text>

      {/* Salary Breakdown */}
      <View style={styles.salaryBreakdownContainer}>
        <Text style={{...styles.totalText, marginBottom: 10}}>
          Gross Salary: ₱{(total + pagibig + philhealth + insurance + sss).toFixed(2)}
        </Text>

        {/* Deductions */}
        <Text style={styles.deductionText}>Pag-IBIG: ₱{pagibig.toFixed(2)}</Text>
        <Text style={styles.deductionText}>PhilHealth: ₱{philhealth.toFixed(2)}</Text>
        <Text style={styles.deductionText}>Insurance: ₱{insurance.toFixed(2)}</Text>
        <Text style={styles.deductionText}>SSS: ₱{sss.toFixed(2)}</Text>

        <Text style={styles.totalText}>Net Salary: ₱{total.toFixed(2)}</Text>
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, statusStyles]}>{status ? 'Confirmed' : 'Pending'}</Text>
      </View>
    </View>
  );
};

// Function to determine status text color based on status
const getStatusStyle = (status: boolean) => {
  return status
    ? { color: '#4caf50' } // Green for confirmed
    : { color: '#ff9800' }; // Orange for pending
};

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowRadius: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  salaryBreakdownContainer: {
    marginBottom: 15,
  },
  salaryText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  deductionText: {
    fontSize: 14,
    color: '#f44336', // Red color for deductions
    marginBottom: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  statusContainer: {
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PayCard;
