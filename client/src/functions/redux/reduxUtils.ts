import { ActionReducerMapBuilder, AsyncThunk, Draft } from "@reduxjs/toolkit";
import { AsyncThunkState } from "../../types/module/redux/asyncThunkTypes";

export const addAsyncCases = <T, Returned extends AsyncThunkState<any>, ThunkArg, RejectedValue>(
  builder: ActionReducerMapBuilder<T>,
  asyncThunk: AsyncThunk<Returned, ThunkArg, { rejectValue: RejectedValue }>,
  setState: (state: Draft<T>, payload: Returned) => void
) => {
  builder
    .addCase(asyncThunk.pending, (state) => {
      setState(state, { state: 'loading' } as unknown as Returned);
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload.state === "success") {
        setState(state, payload);
      } else {
        console.error("完了しましたが、状態が成功ではありませんでした。");
        setState(state, payload);
      }
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      console.error(action.payload);
      setState(state, { state: 'error', value: action.payload as RejectedValue } as unknown as Returned);
    });
}

export const fulfillWithState = <T>(value: T): AsyncThunkState<T> => {
  return { state: 'success', value };
};

export const isSuccessfulPayload = <T>(payload: AsyncThunkState<T>): payload is { state: 'success'; value: T } => {
  return payload.state === 'success' && !!payload.value;
};