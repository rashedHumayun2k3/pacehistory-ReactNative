import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserProfile } from '../../types/user/userProfile.interface';

interface UserState {
  userDetails: UserProfile | null;
  isChangePassword: boolean;
  isResetPassword: boolean;
  isDisableAccount: boolean;
  isEnableAccount: boolean;
  loadingUserDetails: boolean;
  errorUserDetails: string | null;
}

const initialState: UserState = {
  userDetails: null,
  isChangePassword: false,
  isResetPassword: false,
  isDisableAccount: false,
  isEnableAccount: false,
  loadingUserDetails: false,
  errorUserDetails: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

const getAsyncStorage = () => {
  try {
    return require('@react-native-async-storage/async-storage').default;
  } catch {
    return null;
  }
};

const getAccessToken = async () => {
  const storage = getAsyncStorage();
  return storage ? await storage.getItem('accessToken') : null;
};

const setAccessToken = async (token: string) => {
  const storage = getAsyncStorage();
  if (storage) {
    await storage.setItem('accessToken', token);
  }
};

const readErrorMessage = async (response: Response, fallback: string) => {
  try {
    const errorData = await response.json();
    return errorData.message || fallback;
  } catch {
    return fallback;
  }
};

export const fetchUserDetailByProfileName = createAsyncThunk(
  'userManagement/fetchUserDetailsByProfileName',
  async (profileName: string) => {
    const apiUrl = `${getBackendUrl()}/UserProfile/profileName/${profileName}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch user details');
    return response.json();
  },
);

export const fetchUserDetails = createAsyncThunk(
  'userManagement/fetchUserDetails',
  async (userId: string) => {
    const apiUrl = `${getBackendUrl()}/UserProfile/${userId}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch user details');
    return response.json();
  },
);

export const changePassword = createAsyncThunk(
  'userManagement/changePassword',
  async (
    userData: {
      email: string;
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue },
  ) => {
    try {
      if (userData.newPassword !== userData.confirmPassword) {
        throw new Error('New Password and Confirm Password do not match.');
      }

      if (userData.newPassword.length < 8) {
        throw new Error('New Password must be at least 8 characters long.');
      }

      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Authentication token is missing');
      }

      const response = await fetch(`${getBackendUrl()}/UserProfile/PasswordChange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: userData.email,
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, 'Failed to change password'));
      }

      const responseResult = await response.json();
      if (responseResult?.jwtToken) {
        await setAccessToken(responseResult.jwtToken);
      }

      return responseResult;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "We're sorry, but we couldn't process your request. Please try again later.",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  'userManagement/resetPassword',
  async (
    userData: {
      token: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue },
  ) => {
    try {
      if (userData.newPassword !== userData.confirmPassword) {
        throw new Error('New Password and Confirm Password do not match.');
      }

      if (userData.newPassword.length < 8) {
        throw new Error('New Password must be at least 8 characters long.');
      }

      const response = await fetch(`${getBackendUrl()}/UserProfile/ResetPassword`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: userData.token,
          newPassword: userData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, 'Failed to reset password'));
      }

      return response.json();
    } catch (error: any) {
      return rejectWithValue(
        error.message || "We're sorry, but we couldn't process your request. Please try again later.",
      );
    }
  },
);

export const disableAccount = createAsyncThunk(
  'userManagement/disableAccount',
  async (userData: { email: string; userId: string }, { rejectWithValue }) => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Authentication token is missing');
      }

      const response = await fetch(`${getBackendUrl()}/UserProfile/DisableAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, 'Failed to disable account'));
      }

      return response.json();
    } catch (error: any) {
      return rejectWithValue(
        error.message || "We're sorry, but we couldn't disable the account. Please try again later.",
      );
    }
  },
);

export const enableAccount = createAsyncThunk(
  'userManagement/enableAccount',
  async (userData: { email: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getBackendUrl()}/UserProfile/EnableAccount`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, 'Failed to enable account'));
      }

      return response.json();
    } catch (error: any) {
      return rejectWithValue(
        error.message || "We're sorry, but we couldn't enable the account. Please try again later.",
      );
    }
  },
);

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserDetails.pending, state => {
        state.loadingUserDetails = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loadingUserDetails = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loadingUserDetails = false;
        state.errorUserDetails = action.error.message || 'Failed to fetch user details';
      })
      .addCase(fetchUserDetailByProfileName.pending, state => {
        state.loadingUserDetails = true;
      })
      .addCase(fetchUserDetailByProfileName.fulfilled, (state, action) => {
        state.loadingUserDetails = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetailByProfileName.rejected, (state, action) => {
        state.loadingUserDetails = false;
        state.errorUserDetails = action.error.message || 'Failed to fetch user details';
      })
      .addCase(disableAccount.fulfilled, (state, action) => {
        state.isDisableAccount = action.payload;
      })
      .addCase(enableAccount.fulfilled, (state, action) => {
        state.isEnableAccount = action.payload;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isChangePassword = action.payload;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isResetPassword = action.payload;
      });
  },
});

export default userManagementSlice.reducer;
