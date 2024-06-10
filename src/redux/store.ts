import { configureStore } from '@reduxjs/toolkit';
import sampleCounterReducer from './slices/sampleCounterSlice';
import studentDataSlice from './slices/studentDataSlice';

const store = configureStore({
  reducer: {
    sampleCounter: sampleCounterReducer,
    studentDataSlice: studentDataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
