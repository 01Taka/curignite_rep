import { configureStore } from '@reduxjs/toolkit';
import userDataSlice from './slices/userDataSilce';
import appSlice from './slices/appSlice';
import teamSlice from './slices/teamSlice';

const store = configureStore({
  reducer: {
    appSlice: appSlice,
    userDataSlice: userDataSlice,
    teamSlice: teamSlice,
  },
});

export default store;
