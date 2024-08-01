import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializableUserData } from "../../types/firebase/db/user/usersTypes";

export interface UserDataState {
    uid: string | null;
    userData: SerializableUserData | null;
}

const initialState: UserDataState = {
    uid: null,
    userData: null,
}

const userDataSlice = createSlice({
    name: 'userData',
    initialState: initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<SerializableUserData>) => {
            state.uid = action.payload.documentId;
            state.userData = action.payload
        },
    }
})

export const { setUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
