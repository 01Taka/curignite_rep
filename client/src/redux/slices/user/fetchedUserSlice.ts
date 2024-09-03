import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConvertTimestampToNumber, DocumentIdMap } from '../../../types/firebase/db/formatTypes';
import { UserData } from '../../../types/firebase/db/user/userStructure';

interface FetchedUserSliceState {
  users: DocumentIdMap<ConvertTimestampToNumber<UserData>>;
}

const initialState: FetchedUserSliceState = {
  users: {},
};

const FetchedUserSlice = createSlice({
  name: 'fetchedUserSlice',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<DocumentIdMap<ConvertTimestampToNumber<UserData>>>) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = FetchedUserSlice.actions;
export default FetchedUserSlice.reducer;
