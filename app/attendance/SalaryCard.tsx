import { formatDate } from '@/components/helpers/formatDateShift';
import { convertTo12HourFormat } from '@/components/helpers/formatto12Hours';
import { useAuth } from '@/state/AuthContext';
import { AttendanceType } from '@/types';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  MinusCircleIcon,
} from 'react-native-heroicons/outline';

const SalaryCard = ({ data }: { data: AttendanceType }) => {
  const { date, location, locationImage, status, timeIn, timeOut } = data;

  const formattedDate = new Date(date);
  const formattedDateString = `${formattedDate.toLocaleString('default', {
    month: 'long',
  })} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}, ${formattedDate.toLocaleString('default', {
    weekday: 'long',
  })}`;

  const statusStyles = getStatusStyle(status as any);
  const { shifts } = useAuth();

  const shift = shifts.find((x) => x.userId === data.userId && date && formatDate(formattedDate) === x.date);

  const dailyRate = shift?.dailyRate ?? 0;
  const deduction = (data as any)?.deduction ?? 0;
  const total = dailyRate - deduction;

  return (
    <View style={styles.card}>
      <Text style={styles.date}>{formattedDateString}</Text>

      {/* Location Image */}
      {/* Location Coordinates */}

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <DocumentCheckIcon color={'#000'} />
        <Text style={styles.location}>{(data as any)?.salaryisPaid ? 'To be release' : 'Paid'} </Text>
      </View>
      {/* Status and Time Info */}

      {/* Salary Info */}
      <View style={styles.container}>
        <View style={styles.row}>
          <CurrencyDollarIcon
            size={20}
            color='black'
            style={styles.icon}
          />
          <View style={styles.text}>
            <Text style={styles.label}>Daily Rate: </Text>
            <Text style={styles.value}>₱{dailyRate.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <MinusCircleIcon
            size={20}
            color='red'
            style={styles.icon}
          />
          <View style={styles.text}>
            <Text style={styles.label}>Deduction: </Text>
            <Text style={styles.value}>₱{deduction.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <CheckCircleIcon
            size={20}
            color='green'
            style={styles.icon}
          />
          <View style={styles.text}>
            <Text style={styles.label}>Total: </Text>
            <Text style={styles.value}>₱{total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text>
          <Text style={[styles.status, { fontWeight: '400' }]}>Attendance Status: </Text>
          <Text style={[styles.status, statusStyles, { textTransform: 'uppercase' }]}>{status}</Text>
        </Text>
      </View>
    </View>
  );
};

// Function to determine status text color based on status
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending':
      return { color: '#ff9800' };
    case 'present':
      return { color: '#4caf50' };
    case 'confirmed':
      return { color: '#2196f3' };
    case 'completed':
      return { color: '#9e9e9e' };
    case 'leave':
      return { color: '#f44336' };
    default:
      return { color: '#000' };
  }
};

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 0,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  date: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  locationImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  location: {
    fontSize: 14,
    color: '#555',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,
  },

  container: {
    flexDirection: 'column',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between',
    position: 'relative',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    width: '90%',
    alignItems:"center",
    flexDirection:"row",
    display: 'flex',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    marginLeft: 5,
    textAlign: 'right',
  },
});

export default SalaryCard;
