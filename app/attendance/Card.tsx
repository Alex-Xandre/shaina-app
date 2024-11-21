import { convertTo12HourFormat } from '@/components/helpers/formatto12Hours';
import { AttendanceType } from '@/types';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Card = ({ data }: { data: AttendanceType }) => {
  const { date, location, locationImage, status, timeIn, timeOut } = data;
  if (!date) {
    return;
  }
  const formattedDate = new Date(date);
  const formattedDateString = `${formattedDate.toLocaleString('default', {
    month: 'long',
  })} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}, ${formattedDate.toLocaleString('default', {
    weekday: 'long',
  })}`;

  const statusStyles = getStatusStyle(status as any);

  return (
    <View style={styles.card}>
      <Text style={styles.date}>{formattedDateString}</Text>

      {/* Location Image */}
      <Image
        source={{ uri: locationImage }}
        style={styles.locationImage}
      />

      {/* Location Coordinates */}
      <Text style={styles.location}>
        Location: {location && location.latitude.toString()}, {location && location.longitude.toString()}
      </Text>

      {/* Status and Time Info */}
      <View style={styles.bottomContainer}>
        <Text>
          <Text style={[styles.status, { fontWeight: '400' }]}>Status: </Text>
          <Text style={[styles.status, statusStyles, { textTransform: 'uppercase' }]}>{status}</Text>
        </Text>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>in: {timeIn !== '' && convertTo12HourFormat(timeIn)}</Text>
          <Text style={styles.time}>out: {(timeOut !== '' && convertTo12HourFormat(timeOut)) || 'N/A'}</Text>
        </View>
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default Card;
