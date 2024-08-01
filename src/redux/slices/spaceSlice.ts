import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SerializableSpaceData } from '../../types/firebase/db/space/spacesTypes';

interface SpaceSliceState {
  currentSpace: SerializableSpaceData | null;
}

const initialState: SpaceSliceState = {
  currentSpace: null,
};

const spaceSlice = createSlice({
  name: 'spaceSlice',
  initialState,
  reducers: {
    setCurrentSpace: (state, action: PayloadAction<SerializableSpaceData | null>) => {
      state.currentSpace = action.payload;
    },
  },
});

export const { setCurrentSpace } = spaceSlice.actions;
export default spaceSlice.reducer;
