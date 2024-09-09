import { configureStore } from '@reduxjs/toolkit';
import teamSlice from './slices/team/teamSlice';
import spaceSlice from './slices/space/spaceSlice';
import chatRoomSlice from './slices/chat/chatRoomSlice';
import userSlice from './slices/user/userSlice';
import fetchedUserSlice from './slices/user/fetchedUserSlice';
import sessionSlice from './slices/learning/sessionSlice';

const store = configureStore({
  reducer: {
    userSlice,
    fetchedUserSlice,
    teamSlice,
    spaceSlice,
    chatRoomSlice,
    sessionSlice,
  },
});

export default store;
