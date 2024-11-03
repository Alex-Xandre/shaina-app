/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINT } from '@/config/API';
import { USER_API } from '@/config/API_BEARER';
import { handleError } from '@/config/API_ERROR';

export const registerTasks = async (data: any) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/shift/create`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getTasks = async () => {
  try {
    const response = await USER_API.get(`/api/shift/:id`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
