/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

export const counterSlice: any = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state: any) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.
      return (state.value += 1);
    },
    decrement: (state: any) => {
      state.value -= 1;
    },
    incrementByAmount: (state: any, action: any) => {
      return (state.value += action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
