import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfilePictureState {
  base64Image: string | null;
}

const initialState: ProfilePictureState = {
  base64Image: null,
};

const profilePictureSlice = createSlice({
  name: 'profilePicture',
  initialState,
  reducers: {
    setBase64Image(state, action: PayloadAction<string | null>) {
      state.base64Image = action.payload;
    },
    clearBase64Image(state) {
      state.base64Image = null;
    },
  },
});

export const { setBase64Image, clearBase64Image } = profilePictureSlice.actions;

export default profilePictureSlice.reducer;