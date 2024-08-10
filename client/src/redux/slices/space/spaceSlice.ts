import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpaceSliceState } from '../../../types/module/redux/space/spaceSliceTypes';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';
import { SpaceData } from '../../../types/firebase/db/space/spacesTypes';
import { AsyncThunkStatus } from '../../../types/module/redux/asyncThunkTypes';

const initialState: SpaceSliceState = {
  currentSpaceId: "",
  spaces: {},
  todayTotalLearningTime: 0, 
  spacesUpdateState: "idle",
};

const spaceSlice = createSlice({
  name: 'spaceSlice',
  initialState,
  reducers: {
    setCurrentSpaceId: (state, action: PayloadAction<string>) => {
      state.currentSpaceId = action.payload;
    },
    setSpaces: (state, action: PayloadAction<TimestampConvertedDocumentMap<SpaceData>>) => {
      state.spaces = action.payload;
    },
    setTodayTotalLearningTime: (state, action: PayloadAction<number>) => {
      state.todayTotalLearningTime = action.payload;
    },
    setSpacesUpdateState: (state, action: PayloadAction<AsyncThunkStatus>) => {
      state.spacesUpdateState = action.payload;
    }
  },
});

export const { setCurrentSpaceId, setSpaces, setTodayTotalLearningTime, setSpacesUpdateState } = spaceSlice.actions;
export default spaceSlice.reducer;
