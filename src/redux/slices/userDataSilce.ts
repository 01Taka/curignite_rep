import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDataState } from "../../types/app/reduxStateTypes";
import { UsersDB } from "../../firebase/db/app/user/users";

const initialState:  UserDataState = {
    userData: null,
}

const UserDataSlice = createSlice({
    name: 'userData',
    initialState: initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UsersDB>) => {
            state.userData = action.payload;
        }
    }
})

export const { setUserData } = UserDataSlice.actions;
export default UserDataSlice.reducer;
