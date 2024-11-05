/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINT } from '@/config/API';
import { USER_API } from '@/config/API_BEARER';
import { handleError } from '@/config/API_ERROR';

export const registerLeave = async (data: any) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/leave/create`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getLeave = async () => {
  try {
    const response = await USER_API.get(`${API_ENDPOINT}/api/leave/:id`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
