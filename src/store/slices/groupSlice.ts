/* eslint-disable @typescript-eslint/no-explicit-any */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IGroup } from "../../types/group/groupType.interface";

interface GroupState {
  groupList: IGroup[];
  successInUpdate: boolean;
  groupInfo: IGroup | null;
  loading: boolean;
  error: string | null;
  errorGroupInfo: string | null;
  errorGroupInfoByAdmin: string | null;
}

const initialState: GroupState = {
  groupList: [],
  successInUpdate: false,
  groupInfo: null,
  loading: false,
  error: null,
  errorGroupInfo: null,
  errorGroupInfoByAdmin: null,
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

const sampleGroups: IGroup[] = [
  {
    groupID: 1,
    groupName: "Sample Running Group",
    description: "Group data will load here when the backend is configured.",
    facebookURL: "",
    instagramURL: "",
    adminUserId: 101,
  },
];

export const fetchAllGroups = createAsyncThunk(
  "group/fetchAllGroups",
  async (_, { rejectWithValue }) => {
    try {
      await requireAccessToken();
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        return sampleGroups;
      }

      const response = await fetch(`${backendUrl}/Group`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
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

export const fetchAllGroupsByAdmin = createAsyncThunk(
  "group/fetchAllGroupsByAdmin",
  async (adminId: number, { rejectWithValue }) => {
    try {
      await requireAccessToken();
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        return sampleGroups.filter((group) => group.adminUserId === adminId);
      }

      const response = await fetch(`${backendUrl}/Group/GroupsByAdmin/${adminId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
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

export const fetchGroupInfoById = createAsyncThunk(
  "group/fetchGroupInfoById",
  async (groupId: number, { rejectWithValue }) => {
    try {
      const accessToken = await requireAccessToken();
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        return sampleGroups.find((group) => group.groupID === groupId) || sampleGroups[0];
      }

      const response = await fetch(`${backendUrl}/Group/${groupId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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

export const fetchDisableGroup = createAsyncThunk(
  "group/fetchDisableGroup",
  async (groupData: IGroup, { rejectWithValue }) => {
    try {
      await requireAccessToken();
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        return groupData;
      }

      const response = await fetch(`${backendUrl}/Group/DisableGroup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
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

export const fetchGroupInsertUpdate = createAsyncThunk(
  "group/fetchGroupInsertUpdate",
  async (groupData: IGroup, { rejectWithValue }) => {
    try {
      await requireAccessToken();
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        return { data: groupData };
      }

      const response = await fetch(`${backendUrl}/Group/InsertUpdateGroup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
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

export const fetchDeleteGroup = createAsyncThunk(
  "group/fetchDeleteGroup",
  async (groupId: number, { rejectWithValue }) => {
    try {
      await requireAccessToken();
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        return groupId;
      }

      const response = await fetch(`${backendUrl}/Group/DeleteGroup/${groupId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "An unexpected error occurred");
      }

      return groupId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGroups.pending, (state) => {
        state.loading = true;
        state.errorGroupInfo = null;
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groupList = action.payload;
      })
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.loading = false;
        state.errorGroupInfo = action.payload as string;
      })
      .addCase(fetchAllGroupsByAdmin.pending, (state) => {
        state.loading = true;
        state.errorGroupInfo = null;
        state.errorGroupInfoByAdmin = null;
      })
      .addCase(fetchAllGroupsByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.groupList = action.payload;
        state.errorGroupInfoByAdmin = null;
      })
      .addCase(fetchAllGroupsByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.errorGroupInfoByAdmin = action.payload as string;
      })
      .addCase(fetchGroupInfoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupInfoById.fulfilled, (state, action) => {
        state.loading = false;
        state.groupInfo = action.payload;
      })
      .addCase(fetchGroupInfoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGroupInsertUpdate.pending, (state) => {
        state.loading = true;
        state.successInUpdate = false;
        state.error = null;
      })
      .addCase(fetchGroupInsertUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.successInUpdate = true;
        state.groupInfo = action.payload.data;
      })
      .addCase(fetchGroupInsertUpdate.rejected, (state, action) => {
        state.loading = false;
        state.successInUpdate = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDisableGroup.pending, (state) => {
        state.loading = true;
        state.successInUpdate = false;
        state.error = null;
      })
      .addCase(fetchDisableGroup.fulfilled, (state) => {
        state.loading = false;
        state.successInUpdate = true;
      })
      .addCase(fetchDisableGroup.rejected, (state, action) => {
        state.loading = false;
        state.successInUpdate = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDeleteGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groupList = state.groupList.filter(
          (group) => group.groupID !== action.payload
        );
      })
      .addCase(fetchDeleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default groupSlice.reducer;
