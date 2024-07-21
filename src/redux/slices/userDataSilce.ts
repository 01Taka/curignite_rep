import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializableUser } from "../../types/firebase/db/usersTypes";

export interface UserDataState {
    uid: string | null;
    userInfo: SerializableUser | null;
}

const initialState: UserDataState = {
    uid: null,
    userInfo: null,
}

const userDataSlice = createSlice({
    name: 'userData',
    initialState: initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<SerializableUser>) => {
            state.uid = action.payload.documentId;
            state.userInfo = action.payload
        },
    }
})

export const { setUserInfo } = userDataSlice.actions;
export default userDataSlice.reducer;
