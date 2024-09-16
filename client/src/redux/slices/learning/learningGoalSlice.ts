import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserLearningGoalData } from '../../../types/firebase/db/user/userStructure';
import { ConvertTimestampToNumber } from '../../../types/firebase/db/formatTypes';

interface LearningGoalSliceState {
  currentLearningGoal: ConvertTimestampToNumber<UserLearningGoalData> | null;
  targetDuration: number;
  allowedOverflowTime: number;
}

const initialState: LearningGoalSliceState = {
  currentLearningGoal: null,
  targetDuration: 0,
  allowedOverflowTime: 0,
};

const LearningGoalSlice = createSlice({
  name: 'learningGoalSlice',
  initialState,
  reducers: {
    setCurrentGoal: (state, action: PayloadAction<ConvertTimestampToNumber<UserLearningGoalData> | null>) => {
      state.currentLearningGoal = action.payload;
      if (action.payload) {
        state.targetDuration = action.payload.targetDuration
      }
    },
    setTargetDuration: (state, action: PayloadAction<number>) => {
      state.targetDuration = action.payload;
    },
    setAllowedOverflowTime: (state, action: PayloadAction<number>) => {
      state.allowedOverflowTime = action.payload;
    },
    resetLearningGoalSlice: (state) => {
      state.currentLearningGoal = null;
      state.targetDuration = 0;
      state.allowedOverflowTime = 0;
    }
  },
});


export const { setCurrentGoal, setTargetDuration, setAllowedOverflowTime, resetLearningGoalSlice } = LearningGoalSlice.actions;
export default LearningGoalSlice.reducer;
