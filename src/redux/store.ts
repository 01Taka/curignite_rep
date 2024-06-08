import { configureStore } from '@reduxjs/toolkit';
import sampleCounterReducer from './slices/sampleCounterSlice';
import authDataReducer from "./slices/authDataSlice";

const store = configureStore({
  reducer: {
    sampleCounter: sampleCounterReducer,
    authData: authDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
