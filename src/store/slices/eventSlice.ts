/* eslint-disable @typescript-eslint/no-explicit-any */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  EventDistanceCategory,
  IEvent,
} from "../../types/event/eventType.interface";

export interface IEventReactionResult {
  eventId: number;
  totalInterestedCount: number;
  totalGoingCount: number;
  isCurrentUserInterested: boolean;
  isCurrentUserGoing: boolean;
}

export interface IEventReactionCount {
  logId: number;
  eventId?: number;
  eventCode?: string;
  groupId?: number;
  isAlreadyHappen?: boolean;
  userId?: number;
  actionType: string;
  actionModule?: string;
}

interface EventState {
  eventList: IEvent[];
  myGoingEventList: IEvent[];
  myCreatedEvents: IEvent[];
  totalEvents: number;
  currentPage: number;
  totalPages: number;
  unlistedEventList: IEvent[];
  countParticipatedCountForEvent: number;
  eventDetails: IEvent | null;
  categories: any[];
  certificationList: any[];
  eventDistanceWithFeeList: EventDistanceCategory[];
  eventReactionResult: IEventReactionResult | null;
  updateReaction: any;
  loading: {
    events: boolean;
    eventDetails: boolean;
    categories: boolean;
    certificationList: boolean;
    isDistanceLoaded: boolean;
    isEventReactionResult: boolean;
  };
  error: string | null;
  errorUnlistedEvent: string | null;
}

const initialState: EventState = {
  eventList: [],
  myGoingEventList: [],
  myCreatedEvents: [],
  totalEvents: 0,
  currentPage: 0,
  totalPages: 0,
  unlistedEventList: [],
  countParticipatedCountForEvent: 0,
  eventDetails: null,
  categories: [],
  certificationList: [],
  eventDistanceWithFeeList: [],
  eventReactionResult: null,
  updateReaction: null,
  loading: {
    events: false,
    eventDetails: false,
    categories: false,
    certificationList: false,
    isDistanceLoaded: false,
    isEventReactionResult: false,
  },
  error: null,
  errorUnlistedEvent: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "";

const getAccessToken = async () => AsyncStorage.getItem("accessToken");

const sampleEvent = (eventId: string | number = 1001): IEvent => ({
  eventId: Number(eventId) || 1001,
  eventCode: "sample-event",
  eventName: "City 10K",
  eventDate: new Date().toISOString(),
  country: "USA",
  venueDetails: "Lakefront Loop",
});

const apiClient = async (path: string, method: string, body?: unknown) => {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    if (path.includes("GetFilteredEvents")) {
      return {
        data: [sampleEvent()],
        totalCount: 1,
        pageNumber: 1,
        totalPages: 1,
      };
    }

    if (path.includes("EventDistanceWithFee")) return [];
    if (path.includes("GetCertificateList")) return [];
    if (path.includes("GetEventReactionResult")) {
      return {
        eventId: 0,
        totalInterestedCount: 0,
        totalGoingCount: 0,
        isCurrentUserInterested: false,
        isCurrentUserGoing: false,
      };
    }
    if (path.includes("GetEventUsingInParticipated")) return 0;
    if (path.includes("/categories")) return [];
    if (path.includes("Unlisted")) return [];
    if (path.includes("Group/EventList")) return [];

    return sampleEvent(path.split("/").pop() || 1001);
  }

  const response = await fetch(`${backendUrl}/${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || "An unexpected error occurred");
  }

  return result;
};

const filterValidValues = (filters: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== null && value !== undefined)
  );

export const fetchMyCreatedEventList = createAsyncThunk(
  "events/fetchMyCreatedEventList",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    const backendUrl = getBackendUrl();
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return rejectWithValue("Authentication token is missing");
    }

    if (!backendUrl) return [] as IEvent[];

    try {
      const response = await fetch(`${backendUrl}/Event/GetMyCreatedEvents`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token: accessToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch event list");
      }

      return response.json();
    } catch (error: any) {
      console.error("Error fetching created events:", error);
      return rejectWithValue(
        error.message || "An error occurred while fetching the event list."
      );
    }
  }
);

export const fetchEventList = createAsyncThunk(
  "events/fetchEvents",
  async (
    {
      pageNumber,
      pageSize,
      filters,
      isAll,
    }: {
      pageNumber: number;
      pageSize: number;
      filters: Record<string, any>;
      isAll: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        isAll: isAll.toString(),
        ...filterValidValues(filters),
      });

      return await apiClient(`Event/GetFilteredEvents?${queryParams.toString()}`, "GET");
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while fetching the event list."
      );
    }
  }
);

export const fetchEventListByFilter = createAsyncThunk(
  "events/fetchEventListByFilter",
  async (
    {
      pageNumber,
      pageSize,
      filters,
      isAll,
    }: {
      pageNumber: number;
      pageSize: number;
      filters: Record<string, any>;
      isAll: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        isAll: isAll.toString(),
        ...filterValidValues(filters),
      });

      return await apiClient(`Event/GetFilteredEvents?${queryParams.toString()}`, "GET");
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while fetching the event list."
      );
    }
  }
);

export const fetchMyGoingEventList = createAsyncThunk(
  "events/fetchMyGoingEventList",
  async (email: string, { rejectWithValue }) => {
    const backendUrl = getBackendUrl();
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return rejectWithValue("Authentication token is missing");
    }

    if (!backendUrl) return [] as IEvent[];

    try {
      const response = await fetch(`${backendUrl}/Event/GetMyGoingEvents`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token: accessToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch event list");
      }

      return response.json();
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while fetching the event list"
      );
    }
  }
);

export const fetchUnlistedEventListByYear = createAsyncThunk(
  "events/fetchUnlistedEvents",
  async (yearId: number, { rejectWithValue }) => {
    try {
      return await apiClient(`Event/Unlisted/${yearId}`, "GET");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGetParticipationCountAsync = createAsyncThunk(
  "events/fetchGetParticipationCountAsync",
  async (eventId: number, { rejectWithValue }) => {
    try {
      return await apiClient(
        `UserProfile/GetEventUsingInParticipated?eventId=${eventId}`,
        "GET"
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventDetails = createAsyncThunk(
  "events/fetchEventDetails",
  async (eventId: string | number, { rejectWithValue }) => {
    try {
      return await apiClient(`Event/${eventId}`, "GET");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventDetailsByCode = createAsyncThunk(
  "events/fetchEventDetailsByCode",
  async (eventCode: string, { rejectWithValue }) => {
    try {
      return await apiClient(`Event/GetDetailsByEventCode?eventCode=${eventCode}`, "GET");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventCategories = createAsyncThunk(
  "events/fetchEventCategories",
  async (eventId: string, { rejectWithValue }) => {
    try {
      return await apiClient(`Event/${eventId}/categories`, "GET");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventListByGroupId = createAsyncThunk(
  "events/fetchEventByGroupId",
  async (groupId: number, { rejectWithValue }) => {
    try {
      return await apiClient(`Group/EventList/${groupId}`, "GET");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCertificationList = createAsyncThunk(
  "events/fetchCertificationList",
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient("Event/GetCertificateList", "GET");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventDistanceList = createAsyncThunk(
  "events/fetchEventDistanceList",
  async (eventId: number, { rejectWithValue }) => {
    try {
      return await apiClient(`Event/${eventId}/EventDistanceWithFee`, "GET");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGetEventReactionResult = createAsyncThunk<
  IEventReactionResult,
  { eventId: number; userId: number },
  { rejectValue: string }
>(
  "events/fetchGetEventReactionResult",
  async ({ eventId, userId }, { rejectWithValue }) => {
    try {
      const response = await apiClient(
        `Event/GetEventReactionResult?eventId=${eventId}&userId=${userId}`,
        "GET"
      );
      return response as IEventReactionResult;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while fetching event reaction result."
      );
    }
  }
);

export const updateEventGoingInterest = createAsyncThunk(
  "userReaction/updateEventGoingInterest",
  async (userData: IEventReactionCount, { rejectWithValue }) => {
    const backendUrl = getBackendUrl();
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return rejectWithValue("Authentication token is missing");
    }

    if (!backendUrl) return userData;

    try {
      const response = await fetch(`${backendUrl}/Event/ToggleUserEventGoingInterested`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user reaction");
      }

      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const updateEventInterest = createAsyncThunk(
  "userReaction/updateEventInterest",
  async (userData: IEventReactionCount, { rejectWithValue }) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) return userData;

    try {
      const response = await fetch(`${backendUrl}/Event/UpdateInterestGoingReaction`, {
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

      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventList.pending, (state) => {
        state.loading.events = true;
      })
      .addCase(fetchEventList.fulfilled, (state, action) => {
        state.loading.events = false;
        const newEvents = action.payload.data.filter(
          (newEvent: IEvent) =>
            !state.eventList.some(
              (existingEvent) => existingEvent.eventId === newEvent.eventId
            )
        );
        state.eventList = [...state.eventList, ...newEvents];
        state.totalEvents = action.payload.totalCount;
        state.currentPage = action.payload.pageNumber;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchEventList.rejected, (state, action) => {
        state.loading.events = false;
        state.error = action.error.message || "Failed to fetch events";
      })
      .addCase(fetchEventListByFilter.pending, (state) => {
        state.loading.events = true;
      })
      .addCase(fetchEventListByFilter.fulfilled, (state, action) => {
        state.loading.events = false;
        state.eventList = action.payload.data;
        state.totalEvents = action.payload.totalCount;
      })
      .addCase(fetchEventListByFilter.rejected, (state, action) => {
        state.loading.events = false;
        state.error = action.error.message || "Failed to fetch events";
      })
      .addCase(fetchMyGoingEventList.pending, (state) => {
        state.loading.events = true;
      })
      .addCase(fetchMyGoingEventList.fulfilled, (state, action) => {
        state.loading.events = false;
        state.myGoingEventList = action.payload as IEvent[];
      })
      .addCase(fetchMyGoingEventList.rejected, (state) => {
        state.loading.events = false;
      })
      .addCase(fetchMyCreatedEventList.pending, (state) => {
        state.loading.events = true;
      })
      .addCase(fetchMyCreatedEventList.fulfilled, (state, action) => {
        state.loading.events = false;
        state.myCreatedEvents = action.payload as IEvent[];
      })
      .addCase(fetchMyCreatedEventList.rejected, (state) => {
        state.loading.events = false;
      })
      .addCase(fetchUnlistedEventListByYear.pending, (state) => {
        state.loading.events = true;
      })
      .addCase(fetchUnlistedEventListByYear.fulfilled, (state, action) => {
        state.loading.events = false;
        state.unlistedEventList = action.payload as IEvent[];
      })
      .addCase(fetchUnlistedEventListByYear.rejected, (state, action) => {
        state.loading.events = false;
        state.errorUnlistedEvent = action.error.message || "Failed to fetch events";
      })
      .addCase(fetchGetParticipationCountAsync.pending, (state) => {
        state.loading.events = true;
      })
      .addCase(fetchGetParticipationCountAsync.fulfilled, (state, action) => {
        state.loading.events = false;
        state.countParticipatedCountForEvent = action.payload as number;
      })
      .addCase(fetchGetParticipationCountAsync.rejected, (state, action) => {
        state.loading.events = false;
        state.countParticipatedCountForEvent = 0;
        state.errorUnlistedEvent = action.error.message || "Failed to fetch events";
      })
      .addCase(fetchEventDetails.pending, (state) => {
        state.loading.eventDetails = true;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.loading.eventDetails = false;
        state.eventDetails = action.payload as IEvent;
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.loading.eventDetails = false;
        state.error = action.error.message || "Failed to fetch event details";
      })
      .addCase(fetchEventDetailsByCode.pending, (state) => {
        state.loading.eventDetails = true;
      })
      .addCase(fetchEventDetailsByCode.fulfilled, (state, action) => {
        state.loading.eventDetails = false;
        state.eventDetails = action.payload as IEvent;
      })
      .addCase(fetchEventDetailsByCode.rejected, (state, action) => {
        state.loading.eventDetails = false;
        state.error = action.error.message || "Failed to fetch event details";
      })
      .addCase(fetchEventCategories.pending, (state) => {
        state.loading.categories = true;
      })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.categories = action.payload as any[];
      })
      .addCase(fetchEventCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.error = action.error.message || "Failed to fetch event categories";
      })
      .addCase(fetchEventListByGroupId.pending, (state) => {
        state.loading.events = true;
      })
      .addCase(fetchEventListByGroupId.fulfilled, (state, action) => {
        state.loading.events = false;
        state.error = null;
        state.eventList = action.payload as IEvent[];
      })
      .addCase(fetchEventListByGroupId.rejected, (state) => {
        state.eventList = [];
        state.loading.events = false;
        state.error = null;
      })
      .addCase(fetchCertificationList.pending, (state) => {
        state.loading.certificationList = true;
      })
      .addCase(fetchCertificationList.fulfilled, (state, action) => {
        state.loading.certificationList = false;
        state.certificationList = action.payload as any[];
      })
      .addCase(fetchCertificationList.rejected, (state, action) => {
        state.loading.certificationList = false;
        state.error = action.error.message || "Failed to fetch certification";
      })
      .addCase(fetchEventDistanceList.pending, (state) => {
        state.loading.isDistanceLoaded = true;
      })
      .addCase(fetchEventDistanceList.fulfilled, (state, action) => {
        state.loading.isDistanceLoaded = false;
        state.eventDistanceWithFeeList = action.payload as EventDistanceCategory[];
      })
      .addCase(fetchEventDistanceList.rejected, (state, action) => {
        state.loading.isDistanceLoaded = false;
        state.error = action.error.message || "Failed to fetch distance with fee";
      })
      .addCase(updateEventInterest.pending, (state) => {
        state.loading.isDistanceLoaded = true;
      })
      .addCase(updateEventInterest.fulfilled, (state, action) => {
        state.loading.isDistanceLoaded = false;
        state.updateReaction = action.payload;
      })
      .addCase(updateEventInterest.rejected, (state, action) => {
        state.loading.isDistanceLoaded = false;
        state.error = action.error.message || "Failed to fetch distance with fee";
      })
      .addCase(updateEventGoingInterest.pending, (state) => {
        state.loading.isDistanceLoaded = true;
      })
      .addCase(updateEventGoingInterest.fulfilled, (state, action) => {
        state.loading.isDistanceLoaded = false;
        state.updateReaction = action.payload;
      })
      .addCase(updateEventGoingInterest.rejected, (state, action) => {
        state.loading.isDistanceLoaded = false;
        state.error = action.error.message || "Failed to fetch distance with fee";
      })
      .addCase(fetchGetEventReactionResult.pending, (state) => {
        state.loading.isEventReactionResult = true;
      })
      .addCase(fetchGetEventReactionResult.fulfilled, (state, action) => {
        state.loading.isEventReactionResult = false;
        state.eventReactionResult = action.payload;
      })
      .addCase(fetchGetEventReactionResult.rejected, (state, action) => {
        state.loading.isEventReactionResult = false;
        state.error =
          action.error.message || "Failed to fetch to get the reaction result";
      });
  },
});

export default eventSlice.reducer;
