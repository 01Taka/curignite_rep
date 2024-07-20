import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfoForRedux {
    uid: string;
    username: string;
    birthDate: number;
    createdAt: number;
}

// export interface UserOrganizationInfoForRedux {
//     documentId: string;
//     organizationId: string;
//     organizationName: string;
//     grade: number;
//     classNumber: number;
//     joinedAt: number;
// }

export interface UserDataState {
    uid: string | null;
    userInfo: UserInfoForRedux | null;
}

const initialState: UserDataState = {
    uid: null,
    userInfo: null,
}

const userDataSlice = createSlice({
    name: 'userData',
    initialState: initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfoForRedux>) => {
            state.uid = action.payload.uid;
            state.userInfo = action.payload;
        },
    }
})

export const { setUserInfo } = userDataSlice.actions;
export default userDataSlice.reducer;
