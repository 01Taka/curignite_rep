import { configureStore } from '@reduxjs/toolkit';
import sampleCounterReducer from './sampleCounterSlice';

const store = configureStore({
  reducer: {
    sampleCounter: sampleCounterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
