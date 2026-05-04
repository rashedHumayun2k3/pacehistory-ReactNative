import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type UserFollower = {
  totalFollowers: number;
  totalFollowing: number;
};

type UserFollowerState = {
  userFollower: UserFollower | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserFollowerState = {
  userFollower: null,
  loading: false,
  error: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

export const fetchFollower = createAsyncThunk('userFollower/fetchFollower', async (userId: number) => {
  if (!getBackendUrl()) {
    return {
      totalFollowers: 128,
      totalFollowing: 12,
    } satisfies UserFollower;
  }

  const response = await fetch(`${getBackendUrl()}/UserFollower/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch follower info');
  return response.json();
});

export const followUser = createAsyncThunk('userFollower/followUser', async (userId: number) => {
  if (!getBackendUrl()) {
    return {
      totalFollowers: 129,
      totalFollowing: 1,
    } satisfies UserFollower;
  }

  const response = await fetch(`${getBackendUrl()}/UserFollower/${userId}/Follow`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to follow user');
  return response.json();
});

export const unfollowUser = createAsyncThunk('userFollower/unfollowUser', async (userId: number) => {
  if (!getBackendUrl()) {
    return {
      totalFollowers: 128,
      totalFollowing: 0,
    } satisfies UserFollower;
  }

  const response = await fetch(`${getBackendUrl()}/UserFollower/${userId}/Unfollow`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to unfollow user');
  return response.json();
});

const userFollowerSlice = createSlice({
  name: 'userFollowUnfollow',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFollower.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollower.fulfilled, (state, action) => {
        state.loading = false;
        state.userFollower = action.payload;
      })
      .addCase(fetchFollower.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch follower info';
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.userFollower = action.payload;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.userFollower = action.payload;
      });
  },
});

export default userFollowerSlice.reducer;
