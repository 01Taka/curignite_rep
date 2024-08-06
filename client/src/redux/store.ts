import { configureStore } from '@reduxjs/toolkit';
import appSlice from './slices/appSlice';
import teamSlice from './slices/teamSlice';
import spaceSlice from './slices/spaceSlice';
import chatRoomSlice from './slices/chat/chatRoomSlice';
import userSlice from './slices/user/userSlice';

const store = configureStore({
  reducer: {
    appSlice,
    userSlice,
    teamSlice,
    spaceSlice,
    chatRoomSlice,
  },
});

export default store;
