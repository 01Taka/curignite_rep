import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpaceSliceState } from '../../../types/module/redux/space/spaceSliceTypes';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';
import { SpaceData } from '../../../types/firebase/db/space/spacesTypes';
import { AsyncThunkStatus } from '../../../types/module/redux/asyncThunkTypes';
import { addAsyncCases, isSuccessfulPayload } from '../../../functions/redux/reduxUtils';
import { updateTotalLearningTime } from '../../actions/space/spaceActions';

const initialState: SpaceSliceState = {
  currentSpaceId: "",
  spaces: {},
  todayTotalLearningTime: 0, 
  spacesUpdateState: "idle",
  updateTotalLearningTimeState: { state: "idle" },
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
    setSpacesUpdateState: (state, action: PayloadAction<AsyncThunkStatus>) => {
      state.spacesUpdateState = action.payload;
    },
  },
  extraReducers(builder) {
    addAsyncCases(builder, updateTotalLearningTime, (state, payload) => {
      state.updateTotalLearningTimeState = payload;
      if (isSuccessfulPayload(payload) && payload.value !== null) {
        state.todayTotalLearningTime = payload.value;
      }
    });
  },
});

export const { setCurrentSpaceId, setSpaces, setSpacesUpdateState } = spaceSlice.actions;
export default spaceSlice.reducer;
