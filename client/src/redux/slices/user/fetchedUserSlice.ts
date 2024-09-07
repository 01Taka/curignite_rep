import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConvertTimestampToNumber, DocumentIdMap } from '../../../types/firebase/db/formatTypes';
import { UserData } from '../../../types/firebase/db/user/userStructure';
import { FetchedUserSliceState } from '../../../types/module/redux/slice/userSliceTypes';

const initialState: FetchedUserSliceState = {
  users: {},
  notExistUsersId: []
};

const FetchedUserSlice = createSlice({
  name: 'fetchedUserSlice',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<DocumentIdMap<ConvertTimestampToNumber<UserData>>>) => {
      state.users = action.payload;
    },
    setNotExitsUsersId: (state, action: PayloadAction<string[]>) => {
      state.notExistUsersId = action.payload;
    },
    clearNotExistUsersId: (state) => {
      state.notExistUsersId = [];
    },
  },
});

export const { setUsers, setNotExitsUsersId, clearNotExistUsersId } = FetchedUserSlice.actions;
export default FetchedUserSlice.reducer;
