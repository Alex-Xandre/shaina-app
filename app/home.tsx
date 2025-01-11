import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  Image,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { getAttendance, registerAttendance } from "@/api/attendance.api";
import { useAuth } from "@/state/AuthContext";
import AppSidebar from "@/components/Sidebar";
import {
  addAttendance,
  fetchAttendance,
  fetchShifts,
  login,
  signout,
} from "@/state/AuthReducer";
import { getTasks } from "@/api/tasks.api";
import { uploadFile } from "@/api/register.api";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { FolderIcon } from "react-native-heroicons/outline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "@/api/get.info.api";
import { useNavigation } from "expo-router";
import HomeHr from "./hr/home.hr";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Waiting_Driver_Screen = () => {
  const { user, attendance, dispatch, shifts, isLoggedIn } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [initialRegion, setInitialRegion] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<string>("");

  const [images, setImages] = useState("");

  const navigation: any = useNavigation();
  React.useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          const res = await getUser();
          dispatch(login({ user: res, token: storedToken }));
        } else {
          navigation.navigate("auth/login");
          dispatch(signout());
        }
      } catch (error) {
        console.error("Error loading authentication state:", error);
        dispatch(signout());
      }
    };

    loadAuthState();
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    const getUsers = async () => {
      const getAtt = await getAttendance();
      dispatch(fetchAttendance({ attendance: getAtt }));

      const getAllShift = await getTasks();
      dispatch(fetchShifts({ shift: getAllShift }));
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location: any = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      const current = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
      };
      setCurrentDate(current.toLocaleDateString("en-GB", options));
    };

    getLocation();

    if (user && attendance?.length) {
      const today = new Date().toLocaleDateString().split("T")[0];
      const todayRecord = attendance.find(
        (record) =>
          record.userId === user._id &&
          new Date(record.date).toLocaleDateString().split("T")[0] === today
      );

      setData(todayRecord);
      setAttendanceStatus(todayRecord ? (todayRecord.status as any) : "");
    }
  }, [attendance, user]);
  const handleTimeIn = async () => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (images === "") {
      return ToastAndroid.show(
        "Please Attach a picture of your location",
        ToastAndroid.SHORT
      );
    }
    const newAttendanceData = {
      _id: "new",
      userId: user._id,
      date: new Date().toISOString(),
      timeIn: currentTime,
      timeOut: "",
      status: "present",
      locationImage: images,
      location: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
    };

    const res = await registerAttendance(newAttendanceData);

    if (res.success === false) return;

    dispatch(addAttendance(res));
    dispatch({ type: "ADD_ATTENDANCE", payload: res });
  };

  const handleTimeOut = async () => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (!data) return;

    const updatedAttendanceData = {
      ...data,
      timeOut: currentTime,
    };

    const res = await registerAttendance(updatedAttendanceData);

    if (res.success === false) return;
    dispatch({ type: "ADD_ATTENDANCE", payload: res });
  };

  const convertTo12HourFormat = (time: string) => {
    const [hours, minutes] = time.split(":");
    const period = +hours >= 12 ? "PM" : "AM";
    const formattedHours = +hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  };

  const today = new Date().toLocaleDateString().split("T")[0];
  console.log(today);
  const targetDateFormatted = today.split("/");
  console.log(targetDateFormatted);

  const targetDateFormatted2 =
    targetDateFormatted[0] +
    "-" +
    targetDateFormatted[1] +
    "-" +
    targetDateFormatted[2];
  console.log(targetDateFormatted2);
  // today.substring(5, 7) +
  // "-" +
  // today.substring(8, 10) +
  // "-" +
  // today.substring(0, 4);

  // 67;

  const filteredShifts =
    shifts && Array.isArray(shifts)
      ? shifts.filter((shift) => shift.date === targetDateFormatted2)
      : [];

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     try {
  //       const uploadedUrl = await uploadFile(result.assets[0] as any);
  //       setImages(uploadedUrl);
  //     } catch (error) {
  //       console.error('File upload failed:', error);
  //     }
  //   } else {
  //     console.log('Image selection was canceled.');
  //   }
  // };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const uploadedUrl = await uploadFile(result.assets[0] as any);
        setImages(uploadedUrl);
      } catch (error) {
        console.error("File upload failed:", error);
      }
    } else {
      console.log("Image capture was canceled.");
    }
  };

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access camera was denied");
      }
    };

    requestCameraPermission();
  }, []);

  const renderRoute = () => {
    if (!user) return null;
    if (user.role === "user") {
      return (
        <>
          {initialRegion && (
            <View style={styles.containerMap}>
              <MapView
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
                initialRegion={initialRegion}
              >
                {currentLocation && (
                  <Marker
                    coordinate={{
                      latitude: currentLocation.latitude,
                      longitude: currentLocation.longitude,
                    }}
                    title="Your Location"
                  />
                )}
              </MapView>
            </View>
          )}
          {filteredShifts.length > 0 && (
            <TouchableOpacity
              onPress={pickImage}
              style={{
                padding: 13,
                gap: 3,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {images ? (
                <Image
                  source={{
                    uri: images,
                  }}
                  style={{ width: 50, height: 50, marginRight: 10 }}
                />
              ) : (
                <FolderIcon color="#000 " />
              )}
              <Text>Upload Image for attendance</Text>
            </TouchableOpacity>
          )}
          {filteredShifts.length === 0 ? (
            <Text style={{ padding: 10, fontWeight: "700" }}>
              No Shift Found
            </Text>
          ) : (
            <View style={styles.timeContainer}>
              <View style={styles.timeBox}>
                <Text style={styles.label}>Time-in: </Text>
                <Text style={styles.time}>
                  {data?.timeIn
                    ? convertTo12HourFormat(data.timeIn)
                    : "Not clocked in yet"}
                </Text>
                {attendanceStatus !== "present" && (
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
                <Text style={styles.time}>
                  {data?.timeOut
                    ? convertTo12HourFormat(data.timeOut)
                    : "Not clocked out yet"}
                </Text>
                {attendanceStatus === "present" && data?.timeOut === "" ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleTimeOut}
                  >
                    <Text style={styles.buttonText}>Time Out</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          )}
        </>
      );
    }

    if (user.role === "hr") {
      return <HomeHr />;
    }
    if (user.role === "act") {
      return <HomeHr />;
    }
  };

  return (
    <View style={styles.container}>
      <AppSidebar />
      <View style={styles.header}>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      {renderRoute()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 18,
    paddingTop:0, 
    backgroundColor:"white",
    width: "100%",
   
    alignContent: "flex-start",
  },
  header: {
    padding: 16,
   marginTop: 80,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  containerMap: {
    width: "100%",

    height: "50%",
    position: "relative",
  },
  timeContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timeBox: {
    display: "flex",
    gap: 3,
  },
  label: {
    fontWeight: "800",
  },
  time: {
    color: "green",
  },
  button: {
    backgroundColor: "#0055ff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
  },
  button2: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Waiting_Driver_Screen;
