import { ActionReducerMapBuilder, AsyncThunk, Dispatch, Draft } from "@reduxjs/toolkit";
import { AsyncThunkState, AsyncThunkStatus } from "../../types/module/redux/asyncThunkTypes";
import { BaseDocumentData } from "../../types/firebase/db/baseTypes";
import BaseDB from "../../firebase/db/base";


export const addAsyncCases = <T, Returned extends AsyncThunkState<any>, ThunkArg, RejectedValue>(
  builder: ActionReducerMapBuilder<T>,
  asyncThunk: AsyncThunk<Returned, ThunkArg, { rejectValue: RejectedValue }>,
  setState: (state: Draft<T>, payload: Returned) => void
) => {
  builder
    .addCase(asyncThunk.pending, (state) => {
      setState(state, { state: AsyncThunkStatus.LOADING } as unknown as Returned);
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload.state === AsyncThunkStatus.SUCCESS) {
        setState(state, payload);
      } else {
        console.error("完了しましたが、状態が成功ではありませんでした。");
        setState(state, payload);
      }
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      console.error(action.payload);
      setState(state, { state: AsyncThunkStatus.ERROR, value: action.payload as RejectedValue } as unknown as Returned);
    });
}

export const fulfillWithState = <T>(value: T): AsyncThunkState<T> => {
  return { state: AsyncThunkStatus.SUCCESS, value };
};

export const isSuccessfulPayload = <T>(payload: AsyncThunkState<T>): payload is { state: AsyncThunkStatus.SUCCESS; value: T } => {
  return payload.state === AsyncThunkStatus.SUCCESS && !!payload.value;
}

/**
 * コレクションの変更をリアルタイムで監視し、Reduxストアを更新するユーティリティ関数
 * @param dbInstance - データベースインスタンス
 * @param userId - ユーザーID
 * @param filterDataFunction - ユーザーIDに基づいてデータをフィルタリングする関数
 * @param setDataAction - Reduxアクション（データを設定するアクション）
 * @param dispatch - Reduxのdispatch関数
 */
export const autoUpdateCollection = async <T extends BaseDocumentData>(
  dbInstance: BaseDB<T>,
  userId: string,
  filterDataFunction: (userId: string, data: T[]) => (T[] | Promise<T[]>),
  setDataAction: (updatedData: T[]) => any,
  setStateAction: (status: AsyncThunkStatus) => any,
  dispatch: Dispatch
) => {
  const callback: (data: T[]) => Promise<void> = async (data: T[]) => {
    try {
      dispatch(setStateAction(AsyncThunkStatus.LOADING));
      const filteredData = await filterDataFunction(userId, data);
      dispatch(setDataAction(filteredData));
      dispatch(setStateAction(AsyncThunkStatus.SUCCESS));
    } catch (error) {
      console.error('Error in collection update callback:', error);
      dispatch(setStateAction(AsyncThunkStatus.ERROR));
    }
  };

  try {
    dbInstance.addCollectionCallback(callback);
  } catch (error) {
    console.error("Failed to register collection callback:", error);
    dispatch(setStateAction(AsyncThunkStatus.ERROR));
  }
};