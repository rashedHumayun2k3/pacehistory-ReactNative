import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserProfile } from "../../types/user/userProfile.interface";

type UserListRequest = {
  pageIndex: number;
  pageSize: number;
  isTrainer: boolean | null;
  achievements: string[] | null;
  name: string;
};

type UserListFilterRequest = UserListRequest & {
  loggedInUserCountry?: string;
};

interface UserListState {
  userList: UserProfile[];
  loadedPages: number[];
  loading: {
    userList: boolean;
  };
  error: string | null;
}

const initialState: UserListState = {
  userList: [],
  loadedPages: [],
  loading: {
    userList: false,
  },
  error: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "";

const buildQuery = (params: Record<string, string | number | boolean | null | undefined>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  return query.toString();
};

const sampleUsers: UserProfile[] = [
  {
    id: 101,
    firstName: "Sample",
    lastName: "Runner",
    profileName: "sample-runner",
    country: "bd",
    isTrainer: true,
    imageProfilePicture: null,
    imageProfileBanner: null,
    medalPictureLinks: "",
    achievements: "Marathon Finisher,Half Marathon Finisher",
    profileSummery: "Profile summary has not been set yet",
    sportsTrackingApp: "Strava",
    sportsTrackingProfileLink: null,
    prHistory: "Marathon 03:45:00",
  },
];

const fetchUsers = async (params: UserListFilterRequest) => {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return params.pageIndex === 1 ? sampleUsers : [];
  }

  const query = buildQuery({
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    isTrainer: params.isTrainer,
    achievements: params.achievements?.join(","),
    name: params.name,
    loggedInUserCountry: params.loggedInUserCountry,
  });

  const response = await fetch(`${backendUrl}/UserProfile/UserList?${query}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user list");
  }

  return response.json();
};

export const fetchUserList = createAsyncThunk(
  "userList/fetchUserList",
  async (params: UserListRequest) => fetchUsers(params)
);

export const fetchUserListFilter = createAsyncThunk(
  "userList/fetchUserListFilter",
  async (params: UserListFilterRequest) => fetchUsers(params)
);

const userListSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {
    resetLoadedPages(state) {
      state.loadedPages = [];
      state.userList = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading.userList = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading.userList = false;
        state.loadedPages.push(action.meta.arg.pageIndex);
        state.userList =
          action.meta.arg.pageIndex === 1
            ? action.payload
            : [...state.userList, ...action.payload];
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading.userList = false;
        state.error = action.error.message || "Failed to fetch user list";
      })
      .addCase(fetchUserListFilter.pending, (state) => {
        state.loading.userList = true;
        state.error = null;
      })
      .addCase(fetchUserListFilter.fulfilled, (state, action) => {
        state.loading.userList = false;
        state.loadedPages.push(action.meta.arg.pageIndex);
        state.userList =
          action.meta.arg.pageIndex === 1
            ? action.payload
            : [...state.userList, ...action.payload];
      })
      .addCase(fetchUserListFilter.rejected, (state, action) => {
        state.loading.userList = false;
        state.error = action.error.message || "Failed to fetch user list";
      });
  },
});

export const { resetLoadedPages } = userListSlice.actions;
export default userListSlice.reducer;
