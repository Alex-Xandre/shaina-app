// AuthReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendanceType, LeaveType, SalaryType, ShiftType, UserTypes } from '@/types';

export interface AuthState {
  user: any;
  isLoggedIn: boolean;
  token: string;
  allUser: UserTypes[];
  shifts: ShiftType[];
  attendance: AttendanceType[];
  leave: LeaveType[];
  salary: SalaryType[];
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  token: '',
  allUser: [],
  shifts: [],
  attendance: [],
  leave: [],
  salary: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.token = action.payload.token;
    },

    signout: (state) => {
      state.isLoggedIn = false;
      state.token = '';
      state.user = null;
    },

    fetchUsers: (state, action: PayloadAction<{ users: UserTypes[] }>) => {
      state.allUser = action.payload.users;
    },

    fetchShifts: (state, action: PayloadAction<{ shift: ShiftType[] }>) => {
      state.shifts = action.payload.shift;
    },

    fetchLeaves: (state, action: PayloadAction<{ leave: LeaveType[] }>) => {
      state.leave = action.payload.leave;
    },

    fetchAttendance: (state, action: PayloadAction<{ attendance: AttendanceType[] }>) => {
      state.attendance = action.payload.attendance;
    },
    fetchPay: (state, action: PayloadAction<{ salary: SalaryType[] }>) => {
      state.salary = action.payload.salary;
    },

    addUsers: (state, action: PayloadAction<UserTypes>) => {
      const newUser = action.payload;

      const existingUserIndex = state.allUser.findIndex((user) => user._id === newUser?._id);

      if (existingUserIndex !== -1) {
        state.allUser[existingUserIndex] = { ...state.allUser[existingUserIndex], ...newUser };
      } else {
        state.allUser.push(newUser);
      }
    },

    addAttendance: (state, action: PayloadAction<AttendanceType>) => {
      const newAttendance = action.payload;

      const existingAttendanceIndex = state.attendance.findIndex((user) => user._id === newAttendance?._id);

      if (existingAttendanceIndex !== -1) {
        state.attendance[existingAttendanceIndex] = { ...state.attendance[existingAttendanceIndex], ...newAttendance };
      } else {
        state.attendance.push(newAttendance);
      }
    },
    addShift: (state, action: PayloadAction<ShiftType>) => {
      const newShift = action.payload;

      const existingShiftIndex = state.shifts.findIndex((shift) => shift._id === newShift._id);

      if (existingShiftIndex !== -1) {
        state.shifts[existingShiftIndex] = { ...state.shifts[existingShiftIndex], ...newShift };
      } else {
        state.shifts.push(newShift);
      }
    },

    addSalary: (state, action: PayloadAction<SalaryType>) => {
      const newSalary = action.payload;
      const existingSalaryIndex = state.salary.findIndex((salary) => salary._id === newSalary._id);

      if (existingSalaryIndex !== -1) {
        state.salary[existingSalaryIndex] = { ...state.salary[existingSalaryIndex], ...newSalary };
      } else {
        state.salary.push(newSalary);
      }
    },
  },
});

export const {
  login,
  addSalary,
  fetchPay,
  signout,
  fetchUsers,
  addUsers,
  fetchShifts,
  fetchLeaves,
  fetchAttendance,
  addAttendance,
  addShift,
} = authSlice.actions;
export default authSlice.reducer;
