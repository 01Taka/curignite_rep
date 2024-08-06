import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppSliceState {
    isMobile: boolean;
}

const initialState: AppSliceState = {
    isMobile: false,
}

const appSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload;
        },
    }
})

export const { setIsMobile } = appSlice.actions;
export default appSlice.reducer;