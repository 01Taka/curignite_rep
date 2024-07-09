import { configureStore } from '@reduxjs/toolkit';
import studentDataSlice from './slices/studentDataSlice';
import userDataSlice from './slices/userDataSilce';

const store = configureStore({
  reducer: {
    studentDataSlice: studentDataSlice,
    userDataSlice: userDataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
