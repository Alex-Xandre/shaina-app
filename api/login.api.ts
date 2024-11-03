/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from '@/config/API';
import { handleError } from '@/config/API_ERROR';
import axios from 'axios';

export const loginUser = async (data: any) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/api/auth/login`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
