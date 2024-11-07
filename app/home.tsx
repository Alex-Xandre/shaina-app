import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { getAttendance, registerAttendance } from '@/api/attendance.api';
import { useAuth } from '@/state/AuthContext';
import AppSidebar from '@/components/Sidebar';
import { addAttendance, fetchAttendance } from '@/state/AuthReducer';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Waiting_Driver_Screen = () => {
  const { user, attendance, dispatch } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [initialRegion, setInitialRegion] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<string>('');

  useEffect(() => {
    const getUsers = async () => {
      const getAtt = await getAttendance();
      dispatch(fetchAttendance({ attendance: getAtt }));
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location: any = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      const current = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      };
      setCurrentDate(current.toLocaleDateString('en-GB', options));
    };

    getLocation();


    if (user && attendance?.length) {
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = attendance.find(
        (record) => record.userId === user._id && new Date(record.date).toISOString().split('T')[0] === today
      );

      setData(todayRecord);
      setAttendanceStatus(todayRecord ? (todayRecord.status as any) : '');
    }
  }, [attendance, user]);
  const handleTimeIn = async () => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const newAttendanceData = {
      _id: 'new',
      userId: user._id,
      date: new Date().toISOString(),
      timeIn: currentTime,
      timeOut: '',
      status: 'present',
    };

    const res = await registerAttendance(newAttendanceData);

    if (res.success === false) return;

    dispatch(addAttendance(res));
    dispatch({ type: 'ADD_ATTENDANCE', payload: res });
  };

  const handleTimeOut = async () => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    if (!data) return;

    const updatedAttendanceData = {
      ...data,
      timeOut: currentTime,
    };

    const res = await registerAttendance(updatedAttendanceData);

    if (res.success === false) return;
    dispatch({ type: 'ADD_ATTENDANCE', payload: res });
  };

  const convertTo12HourFormat = (time: string) => {
    const [hours, minutes] = time.split(':');
    const period = +hours >= 12 ? 'PM' : 'AM';
    const formattedHours = +hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  };

  return (
    <View style={styles.container}>
      <AppSidebar />
      <View style={styles.header}>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      {initialRegion && (
        <View style={styles.containerMap}>
          <MapView
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            initialRegion={initialRegion}
          >
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title='Your Location'
              />
            )}
          </MapView>
        </View>
      )}

      <View style={styles.timeContainer}>
        <View style={styles.timeBox}>
          <Text style={styles.label}>Time-in: </Text>
          <Text style={styles.time}>{data?.timeIn ? convertTo12HourFormat(data.timeIn) : 'Not clocked in yet'}</Text>
          {attendanceStatus !== 'present' && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleTimeIn}
            >
              <Text style={styles.buttonText}>Time In</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.timeBox}>
          <Text style={styles.label}>Time-out:</Text>
          <Text style={styles.time}>{data?.timeOut ? convertTo12HourFormat(data.timeOut) : 'Not clocked out yet'}</Text>
          {attendanceStatus === 'present' && !data?.timeOut ? (
            <TouchableOpacity
              style={styles.button}
              onPress={handleTimeOut}
            >
              <Text style={styles.buttonText}>Time Out</Text>
            </TouchableOpacity>
          ) : attendanceStatus === 'present' && data?.timeOut === '' ? (
            <TouchableOpacity style={styles.button2}>
              <Text style={styles.buttonText}>Time Out</Text>
            </TouchableOpacity>
          ) : null}
        </View>
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
  header: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  containerMap: {
    width: '100%',
    height: '50%',
    position: 'relative',
  },
  timeContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timeBox: {
    display: 'flex',
    gap: 3,
  },
  label: {
    fontWeight: '800',
  },
  time: {
    color: 'green',
  },
  button: {
    backgroundColor: '#0055ff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
  },
  button2: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Waiting_Driver_Screen;
