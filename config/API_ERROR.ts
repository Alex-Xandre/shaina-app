/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    };
  } else {
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
};
