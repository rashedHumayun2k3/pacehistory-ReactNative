/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LikeForActivityLog } from "../../types/user/userProfile.interface";

export interface IActivityLog {
  activityLogId: number;
  userId: number;
  eventId: number;
  eventCode: string;
  groupId: number | null;
  activityCreator: string;
  activityCreatorProfilePicture: string;
  activityType: string;
  activityDetails: string;
  relatedEntityId: number | null;
  relatedEntityCode: string;
  relatedEntityType: string | null;
  createdDate: Date | string;
  isActive: boolean;
  detailedActivityDetails: string;
  detailedActivityBannerImage: string;
  totalLike: number;
  isLiked: boolean;
  isInterested: boolean;
  isGoing: boolean;
  totalInterestedCount: number;
  totalGoingCount: number;
}

export interface IActivityLogUserList {
  activityLogId: number;
  userId: number;
  fullName: string;
  imageProfilePicture: string;
}

interface ActivityLogState {
  activityLogList: IActivityLog[];
  activityLogUserList: IActivityLogUserList[];
  likes: {
    [activityId: number]: number;
  };
  loading: {
    isActivityLogListLoad: boolean;
  };
  error: string | null;
  hasMore: boolean;
}

const initialState: ActivityLogState = {
  activityLogList: [],
  likes: {},
  activityLogUserList: [],
  loading: {
    isActivityLogListLoad: false,
  },
  error: null,
  hasMore: true,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "";

const sampleActivityLogs: IActivityLog[] = [
  {
    activityLogId: 1,
    userId: 101,
    eventId: 501,
    eventCode: "sample-event",
    groupId: null,
    activityCreator: "Sample Runner",
    activityCreatorProfilePicture: "",
    activityType: "Event",
    activityDetails: "completed a morning tempo run.",
    relatedEntityId: 501,
    relatedEntityCode: "sample-event",
    relatedEntityType: "Event",
    createdDate: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    isActive: true,
    detailedActivityDetails: "8.2 km ▷ 39:54 total time ▷ 4:52/km average pace",
    detailedActivityBannerImage: "",
    totalLike: 0,
    isLiked: false,
    isInterested: false,
    isGoing: false,
    totalInterestedCount: 0,
    totalGoingCount: 0,
  },
];

export const fetchActivityLogList = createAsyncThunk(
  "activityLog/fetchActivityLogList",
  async (
    {
      pageIndex,
      pageSize,
      loggedInUserId,
    }: { pageIndex: number; pageSize: number; loggedInUserId: number },
    { rejectWithValue }
  ) => {
    try {
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        return pageIndex === 1 ? sampleActivityLogs : [];
      }

      const apiUrl = `${backendUrl}/Activity/GetActivityList?pageIndex=${pageIndex}&pageSize=${pageSize}&userId=${loggedInUserId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch activity logs");
      }

      return response.json();
    } catch (error: any) {
      console.error("Error fetching activity logs:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserReaction = createAsyncThunk(
  "userReaction/updateUserReaction",
  async (
    userData: { logId: number; eventId: number; userId: number; actionType: string },
    { rejectWithValue }
  ) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return {
        activityLogId: userData.logId,
        totalLike: 1,
        isCurrentUserLiked: true,
      } as LikeForActivityLog;
    }

    const apiUrl = `${backendUrl}/UserProfile/UpdateReaction`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user reaction");
      }

      return (await response.json()) as LikeForActivityLog;
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const fetchGetActivityLikeUserList = createAsyncThunk(
  "userReaction/fetchGetActivityLikeUserList",
  async (
    userData: { logId: number; eventId: number; activityType: string },
    { rejectWithValue }
  ) => {
    const { logId, eventId, activityType } = userData;
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return [] as IActivityLogUserList[];
    }

    const apiUrl = `${backendUrl}/Activity/GetActivityUserList?id=${logId}&eventId=${eventId}&activityType=${activityType}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch activity user list");
      }

      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const activityLogSlice = createSlice({
  name: "activityLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogList.pending, (state) => {
        state.loading.isActivityLogListLoad = true;
        state.error = null;
      })
      .addCase(fetchActivityLogList.fulfilled, (state, action) => {
        state.loading.isActivityLogListLoad = false;
        state.hasMore = action.payload.length > 0;

        action.payload.forEach((updatedLog: IActivityLog) => {
          const existingLog = state.activityLogList.find(
            (log) => log.activityLogId === updatedLog.activityLogId
          );

          if (existingLog) {
            existingLog.totalLike = updatedLog.totalLike;
            existingLog.isLiked = updatedLog.isLiked;
            existingLog.isInterested = updatedLog.isInterested;
            existingLog.isGoing = updatedLog.isGoing;
            existingLog.totalInterestedCount = updatedLog.totalInterestedCount;
            existingLog.totalGoingCount = updatedLog.totalGoingCount;
          } else {
            state.activityLogList.push(updatedLog);
          }
        });
      })
      .addCase(fetchActivityLogList.rejected, (state, action) => {
        state.loading.isActivityLogListLoad = false;
        state.error = (action.payload as string) || "Failed to fetch activity logs";
      })
      .addCase(updateUserReaction.fulfilled, (state, action) => {
        state.loading.isActivityLogListLoad = false;
        const updatedLog = action.payload as LikeForActivityLog;
        const existingLogIndex = state.activityLogList.findIndex(
          (log) => log.activityLogId === updatedLog.activityLogId
        );

        if (existingLogIndex !== -1) {
          state.activityLogList[existingLogIndex].totalLike = updatedLog.totalLike;
          state.activityLogList[existingLogIndex].isLiked =
            updatedLog.isCurrentUserLiked;
        }
      })
      .addCase(fetchGetActivityLikeUserList.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchGetActivityLikeUserList.fulfilled, (state, action) => {
        state.activityLogUserList = action.payload;
      })
      .addCase(fetchGetActivityLikeUserList.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to fetch activity logs";
      });
  },
});

export default activityLogSlice.reducer;
