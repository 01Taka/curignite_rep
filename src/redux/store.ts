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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
