import { configureStore } from '@reduxjs/toolkit';
import teamSlice from './slices/team/teamSlice';
import spaceSlice from './slices/space/spaceSlice';
import chatRoomSlice from './slices/chat/chatRoomSlice';
import userSlice from './slices/user/userSlice';

const store = configureStore({
  reducer: {
    userSlice,
    teamSlice,
    spaceSlice,
    chatRoomSlice,
  },
});

export default store;
