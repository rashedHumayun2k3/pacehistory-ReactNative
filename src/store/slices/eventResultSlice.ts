/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ParticipatedEventResult } from "../../types/user/userProfile.interface";

interface SystemDB {
  databaseName: string;
}

interface UserEventResultState {
  userEventResult: ParticipatedEventResult[];
  systemDB: SystemDB | null;
  loading: {
    userEventActivity: boolean;
    isUserEventResultLoaded: boolean;
  };
  error: string | null;
}

const initialState: UserEventResultState = {
  userEventResult: [],
  systemDB: null,
  loading: {
    userEventActivity: false,
    isUserEventResultLoaded: false,
  },
  error: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "";

export const fetchuserEventResult = createAsyncThunk(
  "users/fetchuserEventResult",
  async ({ userId, eventId }: { userId: string; eventId: string }) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return [createSampleResult(userId, eventId)];
    }

    const apiUrl = `${backendUrl}/UserProfile/${userId}/EventResultByBothUserAndEvent?eventId=${eventId}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch fetchUserEventSummery");

    return response.json();
  }
);

export const fetchDBName = createAsyncThunk(
  "activityLog/fetchDBName",
  async (_: void, { rejectWithValue }) => {
    try {
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        return { databaseName: "PaceHistory" } as SystemDB;
      }

      const apiUrl = `${backendUrl}/UserProfile/DBName`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse?.message || "Failed to fetch database name");
      }

      return response.json();
    } catch (error: any) {
      console.error("Error fetching database name:", error.message || error);
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

function createSampleResult(userId: string, eventId: string): ParticipatedEventResult {
  return {
    resultId: Number(eventId) || 1,
    userId: Number(userId) || 101,
    userName: "Sample Runner",
    eventId: Number(eventId) || 1001,
    eventName: "City 10K",
    eventYear: 2026,
    bibNumber: "A101",
    raceDistance: "10K",
    finishTime: "48:20",
    pace: "4:50",
    raceScore: 82,
    isBigAchievement: false,
    isPersonalBest: true,
    isAgeGroupWinner: false,
    difficulty: "Medium",
    personalComment: "Strong finish with even pacing.",
    historyOfTheAchievement: "A personal best on a cool morning course.",
    trackingAppName: "Strava",
    trackingRecordLink: "",
    eventResultLink: "",
    isPacer: false,
    isRaceAmbassador: false,
    imageEventFinisher: "",
    imageCertificate: "",
    imageMedalPicture: "",
    eventMadelId: 1,
    ageGroupRank: 7,
    genderWiseRank: 24,
    elevationGain: 82,
    elevationLoss: 80,
    achievementBadgeId: 2,
  };
}

const eventDetailsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchuserEventResult.pending, (state) => {
        state.loading.isUserEventResultLoaded = true;
        state.error = null;
      })
      .addCase(fetchuserEventResult.fulfilled, (state, action) => {
        state.loading.isUserEventResultLoaded = false;
        state.userEventResult = action.payload;
      })
      .addCase(fetchuserEventResult.rejected, (state, action) => {
        state.loading.isUserEventResultLoaded = false;
        state.error = action.error.message || "Failed to fetch event details";
      })
      .addCase(fetchDBName.fulfilled, (state, action) => {
        state.systemDB = action.payload as SystemDB;
      });
  },
});

export default eventDetailsSlice.reducer;
