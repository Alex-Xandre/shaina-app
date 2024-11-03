// AuthReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendanceType, LeaveType, ShiftType, UserTypes } from '@/types';

export interface AuthState {
  user: any;
  isLoggedIn: boolean;
  token: string;
  allUser: UserTypes[];
  shifts: ShiftType[];
  attendance: AttendanceType[];
  leave: LeaveType[];
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  token: '',
  allUser: [],
  shifts: [],
  attendance: [],
  leave: [],
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

    addUsers: (state, action: PayloadAction<UserTypes>) => {
      const newUser = action.payload;
      console.log(newUser);
      const existingUserIndex = state.allUser.findIndex((user) => user._id === newUser?._id);

      if (existingUserIndex !== -1) {
        state.allUser[existingUserIndex] = { ...state.allUser[existingUserIndex], ...newUser };
      } else {
        state.allUser.push(newUser);
      }
    },
  },
});

export const { login, signout, fetchUsers, addUsers, fetchShifts } = authSlice.actions;
export default authSlice.reducer;
