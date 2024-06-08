import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SampleCounterState {
  value: number;
}

const initialState: SampleCounterState = {
  value: 0,
};

const sampleCounterSlice = createSlice({
  name: 'sampleCounter',
  initialState,
  reducers: {
    increment(state) {
      state.value++;
    },
    decrement(state) {
      state.value--;
    },
    set(state, action: PayloadAction<number>) {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, set } = sampleCounterSlice.actions;
export default sampleCounterSlice.reducer;
