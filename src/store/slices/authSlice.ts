import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  loginAs: string | null;
}

const initialState: AuthState = {
  loginAs: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "";

export const fetchUserLoginMode = createAsyncThunk<
  string,
  { emailId: string },
  { rejectValue: string }
>("userProfile/fetchUserLoginMode", async ({ emailId }, { rejectWithValue }) => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return JSON.stringify({
      message: emailId.toLowerCase().includes("owner") ? "Group Owner" : "Athletes",
    });
  }

  const apiUrl = `${backendUrl}/UserProfile/GetUserLoginMode?emailId=${encodeURIComponent(
    emailId
  )}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    const result = await response.text();
    if (!response.ok) {
      throw new Error(result || "An unexpected error occurred");
    }

    return result;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch login mode");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginAs(state, action: PayloadAction<string>) {
      state.loginAs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserLoginMode.fulfilled, (state, action) => {
      try {
        const payload = JSON.parse(action.payload || "{}");
        state.loginAs = payload.message || "";
      } catch {
        state.loginAs = action.payload || "";
      }
    });
  },
});

export const { setLoginAs } = authSlice.actions;
export default authSlice.reducer;
