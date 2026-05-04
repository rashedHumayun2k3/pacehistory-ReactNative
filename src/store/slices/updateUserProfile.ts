import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserProfile } from "../../types/user/userProfile.interface";

type UpdateUserProfileState = {
  loading: boolean;
  success: boolean;
  error: string | null;
  profile: Partial<UserProfile> | null;
};

const initialState: UpdateUserProfileState = {
  loading: false,
  success: false,
  error: null,
  profile: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "";

export const updateUserProfile = createAsyncThunk(
  "updateUserProfile/updateUserProfile",
  async (profile: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const backendUrl = getBackendUrl();
      const accessToken = await AsyncStorage.getItem("accessToken");

      if (!backendUrl) {
        return profile;
      }

      const response = await fetch(`${backendUrl}/UserProfile/UpdateProfile`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(profile),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to update profile");
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

const updateUserProfileSlice = createSlice({
  name: "updateUserProfile",
  initialState,
  reducers: {
    resetUpdateUserProfileState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload as Partial<UserProfile>;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUpdateUserProfileState } = updateUserProfileSlice.actions;
export default updateUserProfileSlice.reducer;
