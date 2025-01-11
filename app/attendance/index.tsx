import { Container } from "@/components/helpers/Container";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppSidebar from "@/components/Sidebar";
import { useAuth } from "@/state/AuthContext";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import Table from "@/components/Table";

import { ScrollView } from "react-native-gesture-handler";
import { getAttendance, registerAttendance } from "@/api/attendance.api";
import {
  fetchAttendance,
  fetchPay,
  fetchShifts,
  fetchUsers,
} from "@/state/AuthReducer";
import { getPay, getTasks } from "@/api/tasks.api";
import { getAllUser } from "@/api/get.info.api";
import Card from "./Card";
import SalaryCard from "./SalaryCard";
import PayCard from "./PayCard";
import { useNavigation } from "expo-router";
import { AttendanceType } from "@/types";
const index = () => {
  const headers = [
    {
      header: "User ID",
      accessor: "userId",
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Date",
      accessor: "date",
    },
    {
      header: "Time In",
      accessor: "timeIn",
    },
    {
      header: "Time Out",
      accessor: "timeOut",
    },
  ];

  const salaryHeader = [
    {
      header: "User ID",
      accessor: "userId",
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Date",
      accessor: "date",
    },
    // {
    //   header: 'Deductions',
    //   accessor: 'deduction',
    // },
    {
      header: "Total",
      accessor: "total",
    },
  ];

  const [isAttendance, setIsAttendance] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { allUser, attendance, shifts, dispatch } = useAuth();
  const [status, setStatus] = useState("all");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { user, salary } = useAuth();

  //get attendance
  useEffect(() => {
    const getUsers = async () => {
      const getAtt = await getAttendance();
      dispatch(fetchAttendance({ attendance: getAtt }));

      const getPays = await getPay();
      dispatch(fetchPay({ salary: getPays }));
    };
    getUsers();
  }, []);

  //get shiffts
  useEffect(() => {
    const getUsers = async () => {
      const getAllShift = await getTasks();

      dispatch(fetchShifts({ shift: getAllShift }));
    };
    getUsers();
  }, []);

  //get All Users

  useEffect(() => {
    const getUsers = async () => {
      const getAllUsers = await getAllUser();

      dispatch(fetchUsers({ users: getAllUsers }));
    };
    getUsers();
  }, []);

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const endDate = today.toISOString().split("T")[0];

    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const generateDateRange = (
    start: string | number | Date,
    end: string | number | Date
  ) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray = [];

    for (let dt = startDate; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      dateArray.push(new Date(dt).toISOString().split("T")[0]);
    }
    return dateArray;
  };

  const convertTo12HourFormat = (timeString: string) => {
    if (!timeString) {
      return;
    }
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;

    return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  const [searchId, setSearchId] = useState("");

  const filteredData = () => {
    if (startDate && endDate) {
      const dateRange = generateDateRange(startDate, endDate);

      const userIdsInShifts = new Set(shifts.map((shift) => shift.userId));

      return allUser.flatMap((user) => {
        if (!userIdsInShifts.has(user._id)) {
          return [];
        }

        return dateRange.map((date) => {
          const formattedDate = new Date(date).toISOString().split("T")[0];

          const [year, month, day] = formattedDate.split("-");
          const formattedDate2 = `${month}-${day}-${year}`;

          const shiftRecord = shifts.find(
            (record) =>
              record.userId === user._id && record.date === formattedDate2
          );
          // console.log(shifts);
          const attendanceRecord = attendance.find(
            (record) =>
              record.userId === user._id &&
              new Date(record.date).toISOString().split("T")[0] ===
                formattedDate
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
              ? attendanceRecord.timeIn === ""
                ? "NOT CLOCKED IN"
                : convertTo12HourFormat(attendanceRecord.timeIn)
              : "NOT CLOCKED IN",
            timeOut: attendanceRecord
              ? attendanceRecord.timeIn === ""
                ? "NOT CLOCKED IN"
                : attendanceRecord.timeOut === ""
                ? "ON DUTY"
                : convertTo12HourFormat(attendanceRecord.timeOut)
              : "N/A",
            status:
              attendanceRecord && attendanceRecord.timeIn
                ? "present"
                : attendanceRecord?.status,
          };
        });
      });
    }
    return [];
  };
  const nav: any = useNavigation();

  const attendanceData = attendance.filter((x) =>
    status === "all" ? x : x.status === status
  );
  return (
    <View style={styles.container}>
      <AppSidebar />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            List of {!isAttendance ? "Attendance" : "Salaries"}
          </Text>
          {/* {user.role !== 'user' && (
            <Button
              text='Attendance'
              onClick={() => nav.navigate('attendance/new')}
            />
          )} */}
        </View>

        <View
          style={{
            alignItems: "center",
            display: "flex",
            width: "100%",
            paddingRight: 10,
            justifyContent: "space-between",
            zIndex: 1000,
          }}
        >
          <View style={styles.datePickerContainer}>
            <View style={styles.dropdownContainer}>
              <Dropdown
                value={status}
                options={[
                  "All",
                  "Present",
                  "Absent",
                  "Late",
                  "Halfday",
                  "Leave",
                ].map((x) => ({
                  value: x.toLowerCase(),
                  label: x.toUpperCase(),
                }))}
                id="status-dropdown"
                onChange={(e) => setStatus(e as string)}
              />
            </View>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.dateText}>{startDate}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.dateText}>{endDate}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.addButton}>
              <PlusIcon color='white' />
              <Text style={styles.buttonText}>Shift</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {showStartDatePicker && (
          <DateTimePicker
            value={new Date(startDate)}
            mode="date"
            display="default"
            onChange={(event, date) => {
              if (event.type === "set") {
                setStartDate(
                  (date && date.toISOString().split("T")[0]) || startDate
                );
              }
              setShowStartDatePicker(false);
            }}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date(endDate)}
            mode="date"
            display="default"
            onChange={(event, date) => {
              if (event.type === "set") {
                setEndDate(
                  (date && date.toISOString().split("T")[0]) || endDate
                );
              }
              setShowEndDatePicker(false);
            }}
          />
        )}

        <View style={styles.tabContainer}>
          <View style={{ flexDirection: "row" }}>
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

        {user.role !== "user" ? (
          <Table
            itemsPerPage={12}
            handleBatch={
              isAttendance &&
              // <div className='inline-flex hover:bg-gray ml-2'>
              //   <span>
              //     <CheckCircleIcon />
              //   </span>
              //   <span className='ml-2 '>Mark All Selected As Paid</span>
              // </div>
              null
            }
            // submitSelected={(e) => handleSubmit(e)}
            handleSearch={(e) => setSearchId(e)}
            title={!isAttendance ? "Attendance" : "Salary"}
            isPay={isAttendance}
            data={
              !isAttendance
                ? filteredData()
                    .filter(
                      (record) =>
                        status === "all" || (record && record.status === status)
                    )
                    ?.filter((x) =>
                      x?.userId?.toLowerCase().includes(searchId?.toLowerCase())
                    )
                    ?.filter((x) => (isAttendance ? x !== null && x.status : x))
                : (salary.map((x) => {
                    const user = allUser.find((y) => y._id === x.userId);
                    return {
                      date: new Date(x.date).toLocaleDateString(),
                      total: x.total,
                      userId: user?.userId,
                      name: user?.firstName + " " + user?.lastName,
                      salaryIsPaid: x.status,
                    };
                  }) as any)
            }
            columns={!isAttendance ? (headers as any) : salaryHeader}
            onEdit={(item: AttendanceType) => {
              nav.navigate("attendance/new", { data: item._id });
            }}
            onRemove={function (): void {
              throw new Error("Function not implemented.");
            }}
            onViewPayment={(data) => {
              function removeAmPm(time: string): string {
                // Assuming time is in the format "hh:mm AM" or "hh:mm PM"
                return time.replace(/ AM| PM/, "");
              }

              const tI = data.timeIn;
              const tO = data.timeOut;
              const handleSubmit = async () => {
                const res = await registerAttendance({
                  ...data,
                  salaryIsPaid: true,
                  timeIn:
                    tI === "N/A" || tI === "NOT CLOCKED IN"
                      ? "00:00"
                      : removeAmPm(data.timeIn),
                  timeOut:
                    tO === "N/A" || tO === "NOT CLOCKED IN"
                      ? "00:00"
                      : removeAmPm(data.timeOut),
                  userId: allUser.find((x) => x.userId === data.userId)?._id,
                });

                if (res.success === false) return;

                dispatch({ type: "ADD_ATTENDANCE", payload: res });
              };

              if (data.salaryIsPaid) {
                //
              } else {
                handleSubmit();
              }
            }}
          />
        ) : (
          <ScrollView
            style={{ paddingRight: 10, flex: 1, backgroundColor: "#fff" }}
            showsVerticalScrollIndicator={false}
          >
            {attendanceData.length === 0 && (
              <Text style={{ marginTop: 10 }}>Attendance List Empty</Text>
            )}

            {!isAttendance &&
              attendanceData.map((x) => {
                return <Card key={x._id} data={x} />;
              })}

            {isAttendance &&
              salary
                .filter((x) => x.userId === user._id)
                .map((y) => {
                  return <PayCard key={y._id} data={y} />;
                })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 18,
    width: "100%",
  },
  content: {
    height: "90%",
    paddingLeft: 15,
    margin: 0,
    marginTop: 100,
    position: "relative",
    paddingRight: 10,
  },

  tableContainer: {
    marginTop: 100,
    marginRight: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },

  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    zIndex: 1000,
    flex: 1,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 8,
    width: 100,
  },
  dateSeparator: {
    marginHorizontal: 4,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  tab: {
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 12,
    paddingHorizontal: 20,
    cursor: "pointer",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginRight: 10,
    color: "#888",
  },
  activeTab: {
    color: "#000",
    borderBottomColor: "#007bff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingLeft: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    marginRight: 8,
  },
  buttonIcon: {
    color: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",

    gap: 12,
  },
  dateText: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderRadius: 5,
    marginTop: 3.5,
  },
});

export default index;
