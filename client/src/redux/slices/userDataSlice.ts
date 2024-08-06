import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializableUserData } from "../../types/firebase/db/user/usersTypes";
import { RequestStatus } from "../../types/util/stateTypes";

export interface UserDataState {
    uid: string | null;
    userData: SerializableUserData | null;
    requestState: RequestStatus;
}

const initialState: UserDataState = {
    uid: null,
    userData: null,
    requestState: 'idle',
};

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<SerializableUserData>) => {
            state.uid = action.payload.docId;
            state.userData = action.payload;
            state.requestState = 'success';  // 成功状態に設定
        },
        setRequestState: (state, action: PayloadAction<RequestStatus>) => {
            state.requestState = action.payload;
        }
    }
});

