import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthStates, StudentDataState } from '../../types/app/appTypes';

const initialState: StudentDataState = {
    authState: "new",
    uid: "",
    iconUrl: "",
    name: "",
    grade: 0,
    classNumber: 0,
    joinedAt: 0,
    signUpCompleted: false,
}

const StudentDataSlice = createSlice({
    name: 'studentData',
    initialState: initialState,
    reducers: {
        setAuthState: (state, action: PayloadAction<AuthStates>) => {
            state.authState = action.payload;
        },
        setUid: (state, action: PayloadAction<string>) => {
            state.uid = action.payload;
        },
        setIconUrl: (state, action: PayloadAction<string>) => {
            state.iconUrl = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setGrade: (state, action: PayloadAction<number>) => {
            state.grade = action.payload;
        },
        setClassNumber: (state, action: PayloadAction<number>) => {
            state.classNumber = action.payload;
        },
        setJoinedAt: (state, action: PayloadAction<number>) => {
            state.joinedAt = action.payload;
        },
        setSignUpCompleted: (state, action: PayloadAction<boolean>) => {
            state.signUpCompleted = action.payload;
        },
        resetStudentData: (state) => {
            state.authState = "new";
            state.uid = "";
            state.iconUrl = "";
            state.name = "";
            state.grade = 0;
            state.classNumber = 0;
            state.joinedAt = 0;
            state.signUpCompleted = false;
        },
        setStudentData: (state, action: PayloadAction<StudentDataState>) => {
            return { ...state, ...action.payload };
        }
    }
})

export const { setAuthState, setUid, setIconUrl, setName, setGrade, setClassNumber, setSignUpCompleted, resetStudentData, setStudentData } = StudentDataSlice.actions;
export default StudentDataSlice.reducer;
