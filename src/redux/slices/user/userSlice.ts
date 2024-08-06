import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializableUserData } from "../../../types/firebase/db/user/usersTypes";
import { RequestStatus } from "../../../types/util/stateTypes";

export interface UserState {
    uid: string | null;
    userData: SerializableUserData | null;
    requestState: RequestStatus;
}

const initialState: UserState = {
    uid: null,
    userData: null,
    requestState: 'idle',
};

const userSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<SerializableUserData>) => {
            state.uid = action.payload.docId;
            state.userData = action.payload;
        },
        setRequestState: (state, action: PayloadAction<RequestStatus>) => {
            state.requestState = action.payload;
        }
    }
});

export const { setUserData, setRequestState } = userSlice.actions;
export default userSlice.reducer;
