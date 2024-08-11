import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LearningSession } from '../../../types/app/space/learningSessionTypes';

const initialState: LearningSession = {
  spaceId: "",
  startTime: 0,
  endTime: 0,
  learningTime: 0,
};

const LearningSessionSlice = createSlice({
  name: 'learningSessionSlice',
  initialState,
  reducers: {
    setSpaceId: (state, action: PayloadAction<string>) => {
      state.spaceId = action.payload;
    },
    setStartTime: (state, action: PayloadAction<number>) => {
      state.startTime = action.payload;
    },
    setEndTime: (state, action: PayloadAction<number>) => {
      state.endTime = action.payload;
    },
    setLearningTime: (state, action: PayloadAction<number>) => {
      state.learningTime = action.payload;
    },
    clearLearningSession: (state) => {
      state = initialState;
    }
  },
});

export const { setSpaceId, setStartTime, setEndTime, setLearningTime, clearLearningSession } = LearningSessionSlice.actions;
export default LearningSessionSlice.reducer;
