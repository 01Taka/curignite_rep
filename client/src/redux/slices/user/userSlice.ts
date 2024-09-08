import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device } from "../../../types/util/stateTypes";
import { AsyncThunkState, AsyncThunkStatus } from "../../../types/module/redux/asyncThunkTypes";
import { addAsyncCases, isSuccessfulPayload } from "../../../functions/redux/reduxUtils";
import { updateUserData } from "../../actions/user/updateUserState";
import { ConvertTimestampToNumber } from "../../../types/firebase/db/formatTypes";
import { UserWithSupplementary } from "../../../types/firebase/db/user/userStructure";

export interface UserState {
    uid: string | null;
    userData: ConvertTimestampToNumber<UserWithSupplementary> | null;
    userFetchState: AsyncThunkState<ConvertTimestampToNumber<UserWithSupplementary> | null>;
    device: Device;
}

const initialState: UserState = {
    uid: null,
    userData: null,
    userFetchState: { state: AsyncThunkStatus.IDLE },
    device: "desktop",
};

const userSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<ConvertTimestampToNumber<UserWithSupplementary>>) => {
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
