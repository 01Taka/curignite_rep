import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthDataState {
    email: string;
    password: string;
}

const initialState: AuthDataState = {
    email: "",
    password: "",
}

const authDataSlice = createSlice({
    name: 'authData',
    initialState: initialState,
    reducers: {
        set(state, action: PayloadAction<AuthDataState>) {
            state = action.payload;
        },
        remove(state) {
            state.email = "";
            state.password = "";
        }
    }
})

export const { set, remove } = authDataSlice.actions;
export default authDataSlice.reducer;