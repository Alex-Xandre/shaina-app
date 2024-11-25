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
import { ToastAndroid } from 'react-native';

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
  console.log("Starting file conversion...");  // Log when conversion begins
  const files = convertToFile(file);

  console.log("Converted file:", files);  // Log the converted file object

  try {
    // Create a new FormData object to hold the file
    const formData = new FormData();
    console.log("Created FormData object.");  // Log when FormData is created

    // Correctly append the file to FormData
    formData.append('docs', files); // Appending the file directly
    console.log("Appended file to FormData.");  // Log after file is appended

    // Send the request to the backend
    console.log("Sending request to backend...");
    const res = await USER_API.post('/api/upload', formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        // Optional: Log progress (can remove this if not needed)
        if (progressEvent.total) {
          ToastAndroid.show(`Upload progress: ${progressEvent?.total}%`, ToastAndroid.SHORT); 
        }
      },
    });

    console.log("Server response received:", res);  // Log the response from the server
    return res.data.url; // Assuming the server responds with the file URL

  } catch (err: any) {
    // Log the error for debugging
    console.error("Error occurred during file upload:", err);

    // If the error has a response object (e.g., from the server), log it
    if (err.response) {
      console.error("Error response from server:", err.response);
    }

    // If there’s no specific message in the response, provide a generic error message
    throw new Error(err.response?.data?.msg || 'Upload failed');
  }
};
