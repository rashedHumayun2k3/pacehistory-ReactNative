import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HelpSupportState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: HelpSupportState = {
  loading: false,
  success: false,
  error: null,
};

export const sendHelpSupportRequest = createAsyncThunk(
  'helpSupport/sendRequest',
  async (
    supportData: {
      subject: string;
      details: string;
      email: string;
      userId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      // ✅ Get token from AsyncStorage
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        return rejectWithValue('Authentication token is missing');
      }

      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
      const apiUrl = `${backendUrl}/HelpSupport/SubmitRequest`;

      // Validation
      if (!supportData.subject || !supportData.details || !supportData.email) {
        throw new Error('All fields are required.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(supportData.email)) {
        throw new Error('Invalid email address.');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // ✅ usually needed
        },
        body: JSON.stringify(supportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Something went wrong. Please try again.'
      );
    }
  }
);

const helpSupportSlice = createSlice({
  name: 'helpSupport',
  initialState,
  reducers: {
    resetSupportState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendHelpSupportRequest.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(sendHelpSupportRequest.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendHelpSupportRequest.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSupportState } = helpSupportSlice.actions;
export default helpSupportSlice.reducer;