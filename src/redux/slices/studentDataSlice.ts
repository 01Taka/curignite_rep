import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StudentDataState {
    uid: string;
    iconUrl: string;
    name: string;
    grade: number;
    classNumber: number;
    joinedAt: number;
    signUpCompleted: boolean;
}

const initialState: StudentDataState = {
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

export const { setUid, setIconUrl, setName, setGrade, setClassNumber, setSignUpCompleted, resetStudentData, setStudentData } = StudentDataSlice.actions;
export default StudentDataSlice.reducer;
