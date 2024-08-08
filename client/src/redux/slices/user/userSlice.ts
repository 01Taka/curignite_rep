import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializableUserData } from "../../../types/firebase/db/user/usersTypes";
import { Device } from "../../../types/util/stateTypes";
import { AsyncThunkState } from "../../../types/module/redux/asyncThunkTypes";
import { addAsyncCases, isSuccessfulPayload } from "../../../functions/redux/reduxUtils";
import { updateUserData } from "../../actions/user/updateUserState";

export interface UserState {
    uid: string | null;
    userData: SerializableUserData | null;
    userFetchState: AsyncThunkState<SerializableUserData | null>;
    device: Device;
}

const initialState: UserState = {
    uid: null,
    userData: null,
    userFetchState: { state: "idle" },
    device: "desktop",
};

const userSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<SerializableUserData>) => {
            state.uid = action.payload.docId;
            state.userData = action.payload;
        },
        setUserDevice: (state, action: PayloadAction<Device>) => {
            state.device = action.payload;
        },
    },
    extraReducers(builder) {
        addAsyncCases(builder, updateUserData, (state, payload) => {
            state.userFetchState = payload;
            if (isSuccessfulPayload(payload) && payload.value !== null) {
                state.uid = payload.value.docId;
                state.userData = payload.value;
            }
        })
    },
});

export const { setUserData, setUserDevice } = userSlice.actions;
export default userSlice.reducer;
