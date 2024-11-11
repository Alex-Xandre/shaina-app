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

// export const uploadFile = async (file: File): Promise<string> => {
//   try {
//     const formData = new FormData();
//     formData.append('requirements', file);

//     const res = await USER_API.post('/api/upload', formData, {
//       headers: {
//         'content-type': 'multipart/form-data',
//       },
//       onUploadProgress: (progressEvent: any) => {
//         if (progressEvent.total < 1024000) {
//           // toast.loading('Uploading...');
//         }
//       },
//     });
//     // toast.dismiss();

//     return res.data.url;
//   } catch (err: any) {
//     // toast.error(err.response?.data?.msg || 'Upload failed');
//     throw new Error(err.response?.data?.msg || 'Upload failed');
//   }
// };
// Fixed `uploadFile` function that directly appends the file
// Function to upload the file

import { ImagePickerAsset } from 'expo-image-picker'; // Import this if using TypeScript

export const convertToFile = (asset: ImagePickerAsset): File => {
  // The `uri` needs to be formatted and the file needs to be transformed into a File object.
  const { uri, mimeType, fileName } = asset;

  // Constructing the File object
  const file = {
    uri,
    type: mimeType,  // Set the MIME type from the asset
    name: fileName,  // Use the file name from the asset
  };

  return file as any;  // Cast to `File` type (if using TypeScript)
};



export const uploadFile = async (file: any): Promise<string> => {

  
  const files = convertToFile(file);  
  try {
    // Create a new FormData object to hold the file
    const formData = new FormData();

    // Correctly append the file to FormData
    formData.append('docs', files); // Appending the file directly


    // Send the request to the backend
    const res = await USER_API.post('/api/upload', formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total < 1024000) {
          // Optional: Show upload progress
        }
      },
    });

    return res.data.url; // Assuming the server responds with the file URL
  } catch (err: any) {
    console.log(err); // Log error for debugging
    throw new Error(err.response?.data?.msg || 'Upload failed');
  }
};
