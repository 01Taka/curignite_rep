import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpaceInfoMap, SpaceSliceState } from '../../../types/module/redux/space/spaceSliceTypes';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';
import { AsyncThunkStatus } from '../../../types/module/redux/asyncThunkTypes';

const initialState: SpaceSliceState = {
  currentSpaceId: "",
  spaceInfoMap: {},
  spaceInfoUpdateState: "idle",
};

const spaceSlice = createSlice({
  name: 'spaceSlice',
  initialState,
  reducers: {
    setCurrentSpaceId: (state, action: PayloadAction<string>) => {
      state.currentSpaceId = action.payload;
    },
    assignSpaceInfoMap: (state, action: PayloadAction<TimestampConvertedDocumentMap<SpaceInfoMap>>) => {
      state.spaceInfoMap = Object.assign({}, state.spaceInfoMap, action.payload);
    },
    setSpacesUpdateState: (state, action: PayloadAction<AsyncThunkStatus>) => {
      state.spaceInfoUpdateState = action.payload;
    },
  }
});

export const { setCurrentSpaceId, assignSpaceInfoMap, setSpacesUpdateState } = spaceSlice.actions;
export default spaceSlice.reducer;
