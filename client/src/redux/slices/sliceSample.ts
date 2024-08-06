import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MySliceState {

}

const initialState: MySliceState = {

};

const MySlice = createSlice({
  name: 'mySlice',
  initialState,
  reducers: {
    sample: (state, action: PayloadAction<string>) => {

    },
  },
});

export const {  } = MySlice.actions;
export default MySlice.reducer;
