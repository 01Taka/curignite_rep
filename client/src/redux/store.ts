import { configureStore } from '@reduxjs/toolkit';
import teamSlice from './slices/team/teamSlice';
import spaceSlice from './slices/space/spaceSlice';
import chatRoomSlice from './slices/chat/chatRoomSlice';
import userSlice from './slices/user/userSlice';
import fetchedUserSlice from './slices/user/fetchedUserSlice';
import learningGoalSlice from './slices/learning/learningGoalSlice';
import taskSlice from './slices/task/taskSlice';

const store = configureStore({
  reducer: {
    userSlice,
    taskSlice,
    fetchedUserSlice,
    teamSlice,
    spaceSlice,
    chatRoomSlice,
    learningGoalSlice,
  },
});

export default store;
