/* eslint-disable @typescript-eslint/no-explicit-any */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ParticipatedEventResult } from "../../types/user/userProfile.interface";

interface EventResultAddEditState {
  loading: boolean;
  successInsert: boolean;
  successUpdate: boolean;
  error: string | null;
  isEventDeleted: boolean;
  eventResultAfterInsertUpdate: ParticipatedEventResult | null;
}

const initialState: EventResultAddEditState = {
  loading: false,
  successInsert: false,
  successUpdate: false,
  error: null,
  isEventDeleted: false,
  eventResultAfterInsertUpdate: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "";

const getAccessToken = async () => AsyncStorage.getItem("accessToken");

const requireAccessToken = async () => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Authentication token is missing");
  }

  return accessToken;
};

export const insertEventActivity = createAsyncThunk(
  "event/insertEventActivity",
  async (eventData: ParticipatedEventResult, { rejectWithValue }) => {
    try {
      const accessToken = await requireAccessToken();
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        return { data: eventData };
      }

      const apiUrl = `${backendUrl}/EventResult/AddParticipatedEventResult`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "An unexpected error occurred");
      }

      return { data: result };
    } catch (error: any) {
      return rejectWithValue(
        error.message ||
          "We're sorry, but we couldn't save your event activity. Please try again later or contact support for assistance."
      );
    }
  }
);

export const updateEventActivity = createAsyncThunk(
  "event/updateEventActivity",
  async (eventData: ParticipatedEventResult, { rejectWithValue }) => {
    try {
      const accessToken = await requireAccessToken();
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        return { data: eventData };
      }

      const apiUrl = `${backendUrl}/EventResult/UpdateParticipatedEventResult`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(eventData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "An unexpected error occurred");
      }

      return { data: result };
    } catch (error: any) {
      return rejectWithValue(
        error.message ||
          "We're sorry, but we couldn't save your event activity. Please try again later or contact support for assistance."
      );
    }
  }
);

export const deleteParticipatedEventResult = createAsyncThunk<
  { userId: number; resultId: number },
  { userId: number; resultId: number },
  { rejectValue: string }
>(
  "event/deleteParticipatedEventResult",
  async ({ userId, resultId }, { rejectWithValue }) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return { userId, resultId };
    }

    const apiUrl = `${backendUrl}/EventResult/DeleteParticipatedEventResult/${userId}/${resultId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || "Failed to delete event result");
      }

      return { userId, resultId };
    } catch (error: any) {
      return rejectWithValue(
        error.message ||
          "We're sorry, but we couldn't delete the event result. Please try again later or contact support."
      );
    }
  }
);

const eventResultAddEditSlice = createSlice({
  name: "eventResultAddEdit",
  initialState,
  reducers: {
    clearEventState: (state) => {
      state.loading = false;
      state.error = null;
      state.eventResultAfterInsertUpdate = null;
      state.successInsert = false;
      state.successUpdate = false;
      state.isEventDeleted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertEventActivity.pending, (state) => {
        state.loading = true;
        state.successInsert = false;
        state.error = null;
      })
      .addCase(insertEventActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.successInsert = true;
        state.eventResultAfterInsertUpdate = action.payload.data;
      })
      .addCase(insertEventActivity.rejected, (state, action) => {
        state.loading = false;
        state.successInsert = false;
        state.error = action.payload as string;
      })
      .addCase(updateEventActivity.pending, (state) => {
        state.loading = true;
        state.successUpdate = false;
        state.error = null;
      })
      .addCase(updateEventActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.successUpdate = true;
        state.eventResultAfterInsertUpdate = action.payload.data;
      })
      .addCase(updateEventActivity.rejected, (state, action) => {
        state.loading = false;
        state.successUpdate = false;
        state.error = action.payload as string;
      })
      .addCase(deleteParticipatedEventResult.pending, (state) => {
        state.loading = true;
        state.isEventDeleted = false;
        state.error = null;
      })
      .addCase(deleteParticipatedEventResult.fulfilled, (state) => {
        state.loading = false;
        state.isEventDeleted = true;
      })
      .addCase(deleteParticipatedEventResult.rejected, (state, action) => {
        state.loading = false;
        state.isEventDeleted = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEventState } = eventResultAddEditSlice.actions;
export default eventResultAddEditSlice.reducer;
