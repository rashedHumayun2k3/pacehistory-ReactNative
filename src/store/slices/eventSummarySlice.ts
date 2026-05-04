import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IEventSummary {
  totalRaces: number;
  longestDistance: number;
  highestElevationGain: number;
  personalBestCount: number;
  ageGroupWinsCount: number;
  bigAchievementsCount: number;
}

interface UserState {
  userEventSummery: IEventSummary | null;
  loading: {
    userEventSummery: boolean;
  };
  error: string | null;
}

const initialState: UserState = {
  userEventSummery: null,
  loading: {
    userEventSummery: false,
  },
  error: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

export const fetchUserEventSummary = createAsyncThunk(
  'eventSummary/fetchUserEventSummary',
  async (userId: number) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return {
        totalRaces: 0,
        longestDistance: 0,
        highestElevationGain: 0,
        personalBestCount: 0,
        ageGroupWinsCount: 0,
        bigAchievementsCount: 0,
      } satisfies IEventSummary;
    }

    const response = await fetch(`${backendUrl}/UserProfile/${userId}/EventSummery`);
    if (!response.ok) throw new Error('Failed to fetch event summary');
    return response.json();
  },
);

const eventSummarySlice = createSlice({
  name: 'eventSummary',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserEventSummary.pending, state => {
        state.loading.userEventSummery = true;
      })
      .addCase(fetchUserEventSummary.fulfilled, (state, action) => {
        state.loading.userEventSummery = false;
        state.userEventSummery = action.payload;
      })
      .addCase(fetchUserEventSummary.rejected, (state, action) => {
        state.loading.userEventSummery = false;
        state.error = action.error.message || 'Failed to fetch event summary';
      });
  },
});

export default eventSummarySlice.reducer;
