import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SerializableSpaceData } from '../../../types/firebase/db/space/spacesTypes';
import { SpaceSliceState } from '../../../types/module/redux/space/spaceSliceTypes';
import { fetchAndSetCurrentSpace, fetchSpaces } from '../../actions/space/updateSpace';
import { addAsyncCases, isSuccessfulPayload } from '../../../functions/redux/reduxUtils';

const initialState: SpaceSliceState = {
  currentSpace: null,
  spaces: [],
  currentSpaceFetchState: { state: "idle" },
  spacesFetchState: { state: "idle" },
};

const spaceSlice = createSlice({
  name: 'spaceSlice',
  initialState,
  reducers: {
    setCurrentSpace: (state, action: PayloadAction<SerializableSpaceData | null>) => {
      state.currentSpace = action.payload;
    },
    setSpaces: (state, action: PayloadAction<SerializableSpaceData[]>) => {
      state.spaces = action.payload;
    },
  },
  extraReducers: (builder) => {
    addAsyncCases(builder, fetchAndSetCurrentSpace, (state, payload) => {
      state.currentSpaceFetchState = payload;
      if (isSuccessfulPayload(payload)) {
        state.currentSpace = payload.value;
      }
    });
    addAsyncCases(builder, fetchSpaces, (state, payload) => {
      state.spacesFetchState = payload;
      if (isSuccessfulPayload(payload)) {
        state.spaces = payload.value;
      }
    });
  }
});

export const { setCurrentSpace, setSpaces } = spaceSlice.actions;
export default spaceSlice.reducer;
