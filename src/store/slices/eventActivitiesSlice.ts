import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ParticipatedEventResult } from "../../types/user/userProfile.interface";

interface EventActivitiesState {
  userEventActivity: ParticipatedEventResult[];
  loading: {
    fetchEventActivity: boolean;
  };
  error: string | null;
}

const initialState: EventActivitiesState = {
  userEventActivity: [],
  loading: {
    fetchEventActivity: false,
  },
  error: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "";

const getAccessToken = async () => AsyncStorage.getItem("accessToken");

const buildHeaders = async () => {
  const accessToken = await getAccessToken();

  return {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

export const fetchUserEventActivitiesByUserCode = createAsyncThunk(
  "eventActivities/fetchUserEventActivitiesByUserCode",
  async (userCode: string) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return [] as ParticipatedEventResult[];
    }

    const apiUrl = `${backendUrl}/UserProfile/ParticipatedEventResultByCode?userCode=${userCode}`;
    const response = await fetch(apiUrl, {
      headers: await buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user EventResult");
    }

    return response.json();
  }
);

export const fetchUserEventActivities = createAsyncThunk(
  "eventActivities/fetchUserEventActivities",
  async (userId: number) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return [] as ParticipatedEventResult[];
    }

    const response = await fetch(
      `${backendUrl}/UserProfile/${userId}/ParticipatedEventResult`,
      {
        headers: await buildHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user EventResult");
    }

    return response.json();
  }
);

const eventActivitiesSlice = createSlice({
  name: "eventActivities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserEventActivities.pending, (state) => {
        state.loading.fetchEventActivity = true;
      })
      .addCase(fetchUserEventActivities.fulfilled, (state, action) => {
        state.loading.fetchEventActivity = false;
        state.userEventActivity = action.payload;
        state.error = null;
      })
      .addCase(fetchUserEventActivities.rejected, (state, action) => {
        state.loading.fetchEventActivity = false;
        state.error = action.error.message || "Failed to fetch event activities";
      })
      .addCase(fetchUserEventActivitiesByUserCode.pending, (state) => {
        state.loading.fetchEventActivity = true;
      })
      .addCase(fetchUserEventActivitiesByUserCode.fulfilled, (state, action) => {
        state.loading.fetchEventActivity = false;
        state.userEventActivity = action.payload;
        state.error = null;
      })
      .addCase(fetchUserEventActivitiesByUserCode.rejected, (state, action) => {
        state.loading.fetchEventActivity = false;
        state.error = action.error.message || "Failed to fetch event activities";
      });
  },
});

export default eventActivitiesSlice.reducer;
