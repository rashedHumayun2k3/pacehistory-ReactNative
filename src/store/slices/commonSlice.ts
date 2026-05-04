import { createSlice } from "@reduxjs/toolkit";

interface CommonState {
  loading: boolean;
  success: boolean;
  error: string | null;
  currentEnvironment: string | null;
}

const getFileServerUrl = () =>
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  "https://pacehistory.com";

const initialState: CommonState = {
  loading: false,
  success: false,
  error: null,
  currentEnvironment: getFileServerUrl(),
};

const common = createSlice({
  name: "common",
  initialState,
  reducers: {
    resetUserState(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.currentEnvironment = getFileServerUrl();
    },
  },
});

export const { resetUserState } = common.actions;
export default common.reducer;
