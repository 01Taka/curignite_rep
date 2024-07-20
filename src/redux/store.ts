import { configureStore } from '@reduxjs/toolkit';
import userDataSlice from './slices/userDataSilce';
import appSlice from './slices/appSlice';

const store = configureStore({
  reducer: {
    appSlice: appSlice,
    userDataSlice: userDataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
