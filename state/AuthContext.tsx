// AuthContext.tsx
import React, { createContext, ReactNode, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, signout } from './AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch, RootState } from '@/store';
import { AttendanceType, LeaveType, SalaryType, ShiftType, UserTypes } from '@/types';
import { getUser } from '@/api/user.api';
import { useNavigation } from 'expo-router';

interface AuthContextProps {
  children: ReactNode;
}

export const AuthContext = createContext<
  | {
      user: any;
      isLoggedIn: boolean;
      dispatch: AppDispatch;
      token: string;
      allUser: UserTypes[];
      shifts: ShiftType[];
      attendance: AttendanceType[];
      leave: LeaveType[];
      salary: SalaryType[];
    }
  | undefined
>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProps) => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const { isLoggedIn, user, token, allUser, shifts, attendance, leave, salary } = useSelector(
    (state: RootState) => state.auth
  );

  React.useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          const res = await getUser();
          dispatch(login({ user: res, token: storedToken }));
        } else {
          navigation.navigate('auth/login');
          dispatch(signout());
        }
      } catch (error) {
        console.error('Error loading authentication state:', error);
        dispatch(signout());
      }
    };

    loadAuthState();
  }, [dispatch, isLoggedIn]);

  React.useEffect(() => {
    const saveAuthState = async () => {
      try {
        if (token) {
          await AsyncStorage.setItem('token', token);
        }
        if (user) {
          await AsyncStorage.setItem('userData', JSON.stringify(user));
        }
      } catch (error) {
        dispatch(signout());
        console.error('Error saving authentication state:', error);
      }
    };

    saveAuthState();
  }, [token]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, allUser, shifts, attendance, leave, dispatch, salary }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return context;
};
