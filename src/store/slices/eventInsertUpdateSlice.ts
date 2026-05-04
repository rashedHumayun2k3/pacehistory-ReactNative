/* eslint-disable @typescript-eslint/no-explicit-any */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IEvent } from "../../types/event/eventType.interface";

interface EventInsertUpdateState {
  actionResult: any;
  loading: boolean;
  errorOnCreatingCustomEvent: string | null;
  isSuccessCreatingEvent: string | null;
}

const initialState: EventInsertUpdateState = {
  actionResult: null,
  loading: false,
  errorOnCreatingCustomEvent: null,
  isSuccessCreatingEvent: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "";

export const fetchEventInsertUpdate = createAsyncThunk(
  "eventInsertUpdate/fetchEventInsertUpdate",
  async (eventData: IEvent, { rejectWithValue }) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const backendUrl = getBackendUrl();

    if (!accessToken || (eventData.createdBy ?? 0) === 0) {
      return rejectWithValue("Authentication token is missing");
    }

    if (!backendUrl) {
      return eventData;
    }

    const apiUrl = `${backendUrl}/Event/InsertUpdateEvent`;

    try {
      const payload = {
        AccessToken: accessToken,
        EventData: eventData,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "An unexpected error occurred");
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const eventInsertUpdateSlice = createSlice({
  name: "eventInsertUpdate",
  initialState,
  reducers: {
    resetEventStatus: (state) => {
      state.isSuccessCreatingEvent = null;
      state.errorOnCreatingCustomEvent = null;
      state.actionResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventInsertUpdate.pending, (state) => {
        state.loading = true;
        state.errorOnCreatingCustomEvent = null;
      })
      .addCase(fetchEventInsertUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.actionResult = action.payload;
        state.isSuccessCreatingEvent = "Data saved successfully";
      })
      .addCase(fetchEventInsertUpdate.rejected, (state, action) => {
        state.loading = false;
        state.errorOnCreatingCustomEvent = action.payload as string;
      });
  },
});

export const { resetEventStatus } = eventInsertUpdateSlice.actions;
export default eventInsertUpdateSlice.reducer;
