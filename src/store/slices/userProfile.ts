import { UserBadge, UserProfile } from '../../types/user/userProfile.interface';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface ReturnWithObject {
  message?: string;
}

interface UserState {
  loading: boolean;
  success: boolean;
  error: string | null;
  userProfile: UserProfile | null;
  badgeListForUser: UserBadge[];
  forgotPassword: boolean;

  successEmailTokenResent: boolean;
  EmailTokenResentError: string | null;
  EmailTokenResent: ReturnWithObject | null;
  ForgotPasswordData: ReturnWithObject | null;
}

const initialState: UserState = {
  loading: false,
  success: false,
  error: null,
  userProfile: null,
  badgeListForUser: [],
  forgotPassword: false,
  successEmailTokenResent: false,
  EmailTokenResentError: null,
  EmailTokenResent: null,
  ForgotPasswordData: null,
};

// 🔹 Helper
const getToken = async () => await AsyncStorage.getItem('accessToken');
const saveToken = async (token: string) => await AsyncStorage.setItem('accessToken', token);

// ✅ SIGNUP
export const signUpUser = createAsyncThunk(
  'userRegistration/signUpUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/UserProfile/SignUp`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Signup failed');
      }

      if (result?.jwtToken) {
        await saveToken(result.jwtToken); // ✅ AsyncStorage
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  'user/login',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/UserProfile/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Login failed');
      }

      if (result?.jwtToken) {
        await saveToken(result.jwtToken);
      }

      await AsyncStorage.setItem('userProfile', JSON.stringify(result.userProfile || result.user || result));

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ FETCH PROFILE
export const fetchUserProfileByEmail = createAsyncThunk(
  'user/fetchUserProfile',
  async (email: string, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const response = await fetch(`${BASE_URL}/UserProfile/email/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message);
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ BADGES
export const fetchAchievementBadge = createAsyncThunk(
  'user/fetchAchievementBadge',
  async (userId: number, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const response = await fetch(`${BASE_URL}/UserProfile/${userId}/BadgeList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message);
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ FORGOT PASSWORD
export const fetchforgotPassword = createAsyncThunk(
  'user/fetchforgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/UserProfile/ForgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress: email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message);
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resentEmailToken = createAsyncThunk(
  'user/resentEmailToken',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/UserProfile/ResendEmailToken`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to resend verification email');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ SLICE (UNCHANGED)
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.userProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userProfile = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userProfile = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAchievementBadge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAchievementBadge.fulfilled, (state, action) => {
        state.loading = false;
        state.badgeListForUser = action.payload as UserBadge[];
      })
      .addCase(fetchAchievementBadge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchforgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.ForgotPasswordData = null;
      })
      .addCase(fetchforgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPassword = true;
        state.ForgotPasswordData = action.payload as ReturnWithObject;
      })
      .addCase(fetchforgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPassword = false;
        state.error = action.payload as string;
      })
      .addCase(resentEmailToken.pending, (state) => {
        state.loading = true;
        state.EmailTokenResentError = null;
        state.EmailTokenResent = null;
        state.successEmailTokenResent = false;
      })
      .addCase(resentEmailToken.fulfilled, (state, action) => {
        state.loading = false;
        state.successEmailTokenResent = true;
        state.EmailTokenResent = action.payload as ReturnWithObject;
      })
      .addCase(resentEmailToken.rejected, (state, action) => {
        state.loading = false;
        state.successEmailTokenResent = false;
        state.EmailTokenResentError = action.payload as string;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
