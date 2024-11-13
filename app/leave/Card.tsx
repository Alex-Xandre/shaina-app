import { LeaveType } from '@/types';
import { View, Text, StyleSheet } from 'react-native';
import { UserIcon, HeartIcon, BriefcaseIcon } from 'react-native-heroicons/outline'; 

const Card = ({ data }: { data: LeaveType }) => {
  const { date, status, endDate, leaveType } = data;

  // Format the start date
  const formattedDate = new Date(date);
  const formattedDateString = `${formattedDate.toLocaleString('default', {
    month: 'long',
  })} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}, ${formattedDate.toLocaleString('default', {
    weekday: 'long',
  })}`;

  // Format the end date
  const formattedEndDate = new Date(endDate);
  const formattedEndDateString = `${formattedEndDate.toLocaleString('default', {
    month: 'long',
  })} ${formattedEndDate.getDate()}, ${formattedEndDate.getFullYear()}, ${formattedEndDate.toLocaleString('default', {
    weekday: 'long',
  })}`;

  // Get the leave type icon, label, and color
  const { icon, label, color } = getLeaveTypeDetails(leaveType);

  // Get status styles
  const statusStyles = getStatusStyle(status as any);

  return (
    <View style={styles.card}>
      {/* Leave Type Icon and Label */}
      <View style={styles.leaveTypeContainer}>
        {icon}
        <Text style={[styles.leaveTypeText, { color: color }]}>{label}</Text>
      </View>

      {/* From Date */}
      <Text style={styles.date}>
        <Text>From: </Text>
        {formattedDateString}
      </Text>

      {/* To Date */}
      <Text style={styles.date}>
        <Text>To: </Text>
        {formattedEndDateString}
      </Text>

      {/* Status and Time Info */}
      <View style={styles.bottomContainer}>
        <Text>
          <Text style={[styles.status, { fontWeight: '400' }]}>Status: </Text>
          <Text style={[styles.status, statusStyles, { textTransform: 'uppercase' }]}>
            {status ? 'Confirmed' : 'Pending'}
          </Text>
        </Text>
      </View>

      <Text style={styles.location}>Last Update: {new Date((data as any)?.updatedAt)?.toLocaleString()}</Text>
    </View>
  );
};

// Function to map leave type to an icon, label, and color
const getLeaveTypeDetails = (leaveType: string) => {
  switch (leaveType) {
    case 'Service Incentive Leave (SIL)':
      return { icon: <BriefcaseIcon size={20} color="#4caf50" />, label: 'SIL', color: '#4caf50' };
    case 'Maternity Leave':
      return { icon: <HeartIcon size={20} color="#f44336" />, label: 'Maternity', color: '#f44336' };
    case 'Paternity Leave':
      return { icon: <HeartIcon size={20} color="#2196f3" />, label: 'Paternity', color: '#2196f3' };
    case 'Parental Leave':
      return { icon: <UserIcon size={20} color="#ff9800" />, label: 'Parental', color: '#ff9800' };
    case 'Sick Leave':
      return { icon: <UserIcon size={20} color="#9c27b0" />, label: 'Sick Leave', color: '#9c27b0' };
    default:
      return { icon: <UserIcon size={20} color="#000" />, label: 'Leave', color: '#000' };
  }
};

// Function to determine status text color based on status
const getStatusStyle = (status: boolean) => {
  switch (status) {
    case false:
      return { color: '#ff9800' };
    case true:
      return { color: '#4caf50' };
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
  leaveTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  leaveTypeText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  location: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
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
});

export default Card;
