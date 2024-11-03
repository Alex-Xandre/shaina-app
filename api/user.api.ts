import { USER_API } from '@/config/API_BEARER';
import { handleError } from '@/config/API_ERROR';
import { UserTypes } from '@/types';
import { ToastAndroid } from 'react-native';

export const getUser = async () => {
  try {
    const response = await USER_API.get(`/api/auth/user`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateUser = async (data: UserTypes) => {
  const response = await USER_API.patch(`/api/auth/update-user`, data);
  return response.data;
};

export const uploadFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('docs', file);

    const res = await USER_API.post('/api/upload', formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        ToastAndroid.show(res.data?.msg || 'Success', ToastAndroid.SHORT);
      },
    });

    return res.data.url;
  } catch (err: any) {
    ToastAndroid.show(err.response?.data?.msg || 'Error', ToastAndroid.SHORT);
    throw new Error(err.response?.data?.msg || 'Upload failed');
  }
};
