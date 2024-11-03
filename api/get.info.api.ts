/* eslint-disable @typescript-eslint/no-explicit-any */

import { USER_API } from '@/config/API_BEARER';
import { handleError } from '@/config/API_ERROR';

export const getUser = async () => {
  try {
    const response = await USER_API.get(`/api/auth/user`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getAllUser = async () => {
  try {
    const response = await USER_API.get(`/api/auth/all-user`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
