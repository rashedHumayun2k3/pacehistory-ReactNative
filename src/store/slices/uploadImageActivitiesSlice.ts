import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ImageState {
  uploading: boolean;
  imageDelete: boolean;
  isImageDeletedSuccessfully: boolean;
  success: boolean;
  errorImageUpload: string | null;
  uploadedImages: { filePath: string; uploadPurpose: string }[];
}

const initialState: ImageState = {
  uploading: false,
  imageDelete: false,
  isImageDeletedSuccessfully: false,
  success: false,
  errorImageUpload: null,
  uploadedImages: [],
};

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// ✅ Upload Image
export const uploadImage = createAsyncThunk(
  "image/uploadImage",
  async (
    {
      file, // 👈 now it's URI-based
      userId,
      eventId,
      uploadPurpose,
      tableName,
    }: {
      file: { uri: string; name: string; type: string };
      userId: string;
      eventId: number;
      uploadPurpose: string;
      tableName: string;
    },
    thunkAPI
  ) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        return thunkAPI.rejectWithValue('Authentication required');
      }

      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);

      formData.append("userId", userId);
      formData.append("eventId", eventId.toString());
      formData.append("uploadPurpose", uploadPurpose);
      formData.append("tableName", tableName);
      formData.append("accessToken", accessToken);

      const response = await fetch(`${BASE_URL}/fileapi/Upload/upload-image`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Upload failed');
      }

      return {
        fileUrl: result.filePath,
        uploadPurpose,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ✅ Delete Image
export const deleteUploadImage = createAsyncThunk(
  "image/deleteUploadImage",
  async (
    { userId, eventId, uploadPurpose, tableName, imageName }: any,
    thunkAPI
  ) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        return thunkAPI.rejectWithValue('Authentication required');
      }

      const formData = new FormData();

      formData.append("userId", userId.toString());
      formData.append("eventId", eventId.toString());
      formData.append("uploadPurpose", uploadPurpose);
      formData.append("tableName", tableName);
      formData.append("imageName", imageName);
      formData.append("accessToken", accessToken);

      const response = await fetch(
        `${BASE_URL}/fileapi/Upload/removed-upload-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Delete failed');
      }

      return { imageName };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice (UNCHANGED mostly)
const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    resetSuccess(state) {
      state.success = false;
    },
    resetImageDelete(state) {
      state.isImageDeletedSuccessfully = false;
    },
    resetError(state) {
      state.errorImageUpload = null;
    },
    resetUploadedImages(state) {
      state.uploadedImages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.uploading = true;
        state.errorImageUpload = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.success = true;

        if (action.payload) {
          const { fileUrl, uploadPurpose } = action.payload;
          state.uploadedImages.push({ filePath: fileUrl, uploadPurpose });
        }
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploading = false;
        state.errorImageUpload = action.payload as string;
      })
      .addCase(deleteUploadImage.pending, (state) => {
        state.imageDelete = true;
        state.isImageDeletedSuccessfully = false;
      })
      .addCase(deleteUploadImage.fulfilled, (state, action) => {
        state.imageDelete = false;
        state.isImageDeletedSuccessfully = true;

        const { imageName } = action.payload;
        state.uploadedImages = state.uploadedImages.filter(
          (img) => img.filePath !== imageName
        );
      })
      .addCase(deleteUploadImage.rejected, (state, action) => {
        state.imageDelete = false;
        state.errorImageUpload = action.payload as string;
      });
  },
});

export const {
  resetSuccess,
  resetError,
  resetUploadedImages,
  resetImageDelete,
} = imageSlice.actions;

export default imageSlice.reducer;