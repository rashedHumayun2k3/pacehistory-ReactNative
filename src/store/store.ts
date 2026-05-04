import { configureStore } from '@reduxjs/toolkit';
import activityLogReducer from './slices/activityLogSlice';
import authReducer from './slices/authSlice';
import blogReducer from './slices/blogSlice';
import commonReducer from './slices/commonSlice';
import eventActivitiesReducer from './slices/eventActivitiesSlice';
import eventInsertUpdateReducer from './slices/eventInsertUpdateSlice';
import eventReducer from './slices/eventSlice';
import eventResultAddEditReducer from './slices/eventResultAddEditSlice';
import eventResultReducer from './slices/eventResultSlice';
import eventSummaryReducer from './slices/eventSummarySlice';
import groupReducer from './slices/groupSlice';
import medalListReducer from './slices/medalListSlice';
import uploadImageReducer from './slices/uploadImageActivitiesSlice';
import updateUserProfileReducer from './slices/updateUserProfile';
import userManagementReducer from './slices/userManagementSlice';
import userFollowerReducer from './slices/userFollowerSlice';
import userListReducer from './slices/userListSlice';
import userProfileReducer from './slices/userProfile';

export const store = configureStore({
  reducer: {
    activityLog: activityLogReducer,
    authStore: authReducer,
    blog: blogReducer,
    commonAll: commonReducer,
    event: eventReducer,
    eventActivities: eventActivitiesReducer,
    eventInsertUpdate: eventInsertUpdateReducer,
    eventResultAddEdit: eventResultAddEditReducer,
    eventResult: eventResultReducer,
    group: groupReducer,
    medalList: medalListReducer,
    uploadImage: uploadImageReducer,
    updateUserProfile: updateUserProfileReducer,
    userEventSummeryOutput: eventSummaryReducer,
    userFollowUnfollow: userFollowerReducer,
    userList: userListReducer,
    userManagement: userManagementReducer,
    userProfile: userProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
