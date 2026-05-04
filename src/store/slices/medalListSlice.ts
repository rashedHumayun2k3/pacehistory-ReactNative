import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { EventCertificate, UserMedals } from '../../types/user/userProfile.interface.native';

interface UserState {
  userMadelList: UserMedals[];
  certificateList: EventCertificate[];
  eventCustomMadelList: UserMedals[];
  madelDetails: UserMedals | null;
  loading: {
    madelDetails: boolean;
    userMadelList: boolean;
    isCustomMadelList: boolean;
    userCertificateList: boolean;
  };
  errorMadelPicture: string | null;
  errorCertificatePicture: string | null;
  successDeleteImage: boolean;
  errorImageUpload: string | null;
}

const initialState: UserState = {
  userMadelList: [],
  certificateList: [],
  eventCustomMadelList: [],
  madelDetails: null,
  loading: {
    madelDetails: false,
    userMadelList: false,
    isCustomMadelList: false,
    userCertificateList: false,
  },
  errorMadelPicture: null,
  errorCertificatePicture: null,
  successDeleteImage: false,
  errorImageUpload: null,
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

const getFileServerUrl = () =>
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  '';

const getAsyncStorage = () => {
  try {
    return require('@react-native-async-storage/async-storage').default;
  } catch {
    return null;
  }
};

const getAccessToken = async () => {
  const storage = getAsyncStorage();
  return storage ? await storage.getItem('accessToken') : null;
};

export const fetchUserMedalList = createAsyncThunk(
  'medalList/fetchUserMedalList',
  async (userId: number) => {
    const response = await fetch(`${getBackendUrl()}/UserProfile/${userId}/MadelList`);
    if (!response.ok) throw new Error('Failed to fetch medal list');
    return response.json();
  },
);

export const fetchUserCertificateList = createAsyncThunk(
  'medalList/fetchUserCertificateList',
  async (userId: number) => {
    const response = await fetch(`${getBackendUrl()}/UserProfile/${userId}/CertificateList`);
    if (!response.ok) throw new Error('Failed to fetch certificate list');
    return response.json();
  },
);

export const fetchMedalInfoByEventId = createAsyncThunk(
  'medalList/fetchUserMedalInfo',
  async (userId: number) => {
    const response = await fetch(`${getBackendUrl()}/UserProfile/MadelDetailsByEvent?eventId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch medal list');
    return response.json();
  },
);

export const fetchMedalListCustomByEventId = createAsyncThunk(
  'medalList/fetchMedalListCustomByEventId',
  async (eventId: number) => {
    const response = await fetch(`${getBackendUrl()}/Event/${eventId}/MedalListCustom`);
    if (!response.ok) throw new Error('Failed to fetch medal list');
    return response.json();
  },
);

export const fetchDeleteMedalImage = createAsyncThunk(
  'medalList/fetchDeleteMedalImage',
  async ({ eventMadelId, userId }: { eventMadelId: number; userId: number }) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('Authentication token is missing');
    }

    const response = await fetch(
      `${getFileServerUrl()}/fileapi/Upload/DeleteMedalImage?eventMadelId=${eventMadelId}&userId=${userId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) throw new Error('Failed to delete medal image');
    return response.json();
  },
);

const medalListSlice = createSlice({
  name: 'medalList',
  initialState,
  reducers: {
    resetSuccessDeleteImage(state) {
      state.successDeleteImage = false;
    },
    resetError(state) {
      state.errorImageUpload = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserMedalList.pending, state => {
        state.loading.userMadelList = true;
      })
      .addCase(fetchUserMedalList.fulfilled, (state, action) => {
        state.loading.userMadelList = false;
        state.userMadelList = action.payload;
      })
      .addCase(fetchUserMedalList.rejected, (state, action) => {
        state.loading.userMadelList = false;
        state.errorMadelPicture = action.error.message || 'Failed to fetch medal list';
      })
      .addCase(fetchMedalInfoByEventId.pending, state => {
        state.loading.madelDetails = true;
      })
      .addCase(fetchMedalInfoByEventId.fulfilled, (state, action) => {
        state.loading.madelDetails = false;
        state.madelDetails = action.payload;
      })
      .addCase(fetchMedalInfoByEventId.rejected, (state, action) => {
        state.loading.madelDetails = false;
        state.errorMadelPicture = action.error.message || 'Failed to fetch medal details';
      })
      .addCase(fetchMedalListCustomByEventId.pending, state => {
        state.loading.isCustomMadelList = true;
      })
      .addCase(fetchMedalListCustomByEventId.fulfilled, (state, action) => {
        state.loading.isCustomMadelList = false;
        state.eventCustomMadelList = action.payload;
      })
      .addCase(fetchMedalListCustomByEventId.rejected, (state, action) => {
        state.loading.isCustomMadelList = false;
        state.errorMadelPicture = action.error.message || 'Failed to fetch medal details';
      })
      .addCase(fetchDeleteMedalImage.pending, state => {
        state.successDeleteImage = false;
        state.errorImageUpload = null;
      })
      .addCase(fetchDeleteMedalImage.fulfilled, state => {
        state.successDeleteImage = true;
        state.errorImageUpload = null;
      })
      .addCase(fetchDeleteMedalImage.rejected, state => {
        state.successDeleteImage = false;
        state.errorImageUpload = 'Image upload failed';
      })
      .addCase(fetchUserCertificateList.pending, state => {
        state.loading.userCertificateList = true;
      })
      .addCase(fetchUserCertificateList.fulfilled, (state, action) => {
        state.loading.userCertificateList = false;
        state.certificateList = action.payload;
      })
      .addCase(fetchUserCertificateList.rejected, (state, action) => {
        state.loading.userCertificateList = false;
        state.errorCertificatePicture = action.error.message || 'Failed to fetch certificate list';
      });
  },
});

export const { resetSuccessDeleteImage, resetError } = medalListSlice.actions;
export default medalListSlice.reducer;
