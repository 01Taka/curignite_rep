import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpaceSliceState } from '../../../types/module/redux/space/spaceSliceTypes';
import { fetchSpaces } from '../../actions/space/updateSpace';
import { addAsyncCases, isSuccessfulPayload } from '../../../functions/redux/reduxUtils';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';
import { SpaceData } from '../../../types/firebase/db/space/spacesTypes';

const initialState: SpaceSliceState = {
  currentSpaceId: "",
  spaces: {},
  spacesFetchState: { state: "idle" },
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
  },
  extraReducers: (builder) => {
    addAsyncCases(builder, fetchSpaces, (state, payload) => {
      state.spacesFetchState = payload;
      if (isSuccessfulPayload(payload)) {
        state.spaces = payload.value;
      }
    });
  }
});

export const { setCurrentSpaceId, setSpaces } = spaceSlice.actions;
export default spaceSlice.reducer;
