/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from '@/config/API';
import { USER_API } from '@/config/API_BEARER';
import { handleError } from '@/config/API_ERROR';
import axios from 'axios';

export const registerUser = async (data: any) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/api/auth/register`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const registerUserByAdmin = async (data: any) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/auth/add-user`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateProfile = async (data: any) => {
  try {
    const response = await USER_API.patch(`${API_ENDPOINT}/api/auth/update-user/`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const uploadFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('requirements', file);

    const res = await USER_API.post('/api/upload', formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total < 1024000) {
          // toast.loading('Uploading...');
        }
      },
    });
    // toast.dismiss();

    return res.data.url;
  } catch (err: any) {
    // toast.error(err.response?.data?.msg || 'Upload failed');
    throw new Error(err.response?.data?.msg || 'Upload failed');
  }
};
