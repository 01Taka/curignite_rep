// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface AuthDataState {
//     username: string;
//     email: string;
//     password: string;
// }

// const initialState: AuthDataState = {
//     username: "",
//     email: "",
//     password: "",
// }

// const authDataSlice = createSlice({
//     name: 'authData',
//     initialState: initialState,
//     reducers: {
//         setAuthData(state, action: PayloadAction<AuthDataState>) {
//             state.username = action.payload.username;
//             state.email = action.payload.email;
//             state.password = action.payload.password;
//         },
//         setUserName(state, action: PayloadAction<string>) {
//             state.username = action.payload;
//         },
//         setEmail(state, action: PayloadAction<string>) {
//             state.email = action.payload;
//         },
//         setPassword(state, action: PayloadAction<string>) {
//             state.password = action.payload;
//         },
//         removeAuthData(state) {
//             state.username = "";
//             state.email = "";
//             state.password = "";
//         }
//     }
// })

// export const { setAuthData, setUserName, setEmail, setPassword, removeAuthData } = authDataSlice.actions;
// export default authDataSlice.reducer;

export {}