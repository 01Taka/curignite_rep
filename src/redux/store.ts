import { configureStore } from '@reduxjs/toolkit';
import userDataSlice from './slices/userDataSlice';
import appSlice from './slices/appSlice';
import teamSlice from './slices/teamSlice';
import spaceSlice from './slices/spaceSlice';
import chatRoomSlice from './slices/chat/chatRoomSlice';

const store = configureStore({
  reducer: {
    appSlice,
    userDataSlice,
    teamSlice,
    spaceSlice,
    chatRoomSlice,
  },
});

export default store;
