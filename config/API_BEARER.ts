import axios, { InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINT } from './API';

export const USER_API = axios.create({ baseURL: API_ENDPOINT });

USER_API.interceptors.request.use(async (req: InternalAxiosRequestConfig<any>) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
