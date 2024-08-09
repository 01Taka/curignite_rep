import { ActionReducerMapBuilder, AsyncThunk, Dispatch, Draft } from "@reduxjs/toolkit";
import { AsyncThunkState, AsyncThunkStatus } from "../../types/module/redux/asyncThunkTypes";
import { BaseDocumentData } from "../../types/firebase/db/baseTypes";
import BaseDB from "../../firebase/db/base";
import { TimestampConvertedDocumentMap } from "../../types/firebase/db/formatTypes";
import { arrayToDictWithTimestampToNumbers } from "../db/dataFormatUtils";

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

/**
 * コレクションの変更をリアルタイムで監視し、Reduxストアを更新するユーティリティ関数
 * @param dbInstance - データベースインスタンス
 * @param userId - ユーザーID
 * @param filterDataFunction - ユーザーIDに基づいてデータをフィルタリングする関数
 * @param setDataAction - Reduxアクション（データを設定するアクション）
 * @param getPrevData - 以前のデータを取得する関数
 * @param dispatch - Reduxのdispatch関数
 */
export const autoUpdateCollection = <T extends BaseDocumentData>(
  dbInstance: BaseDB<T>,
  userId: string,
  filterDataFunction: (userId: string, data: T[]) => T[],
  setDataAction: (data: Record<string, any>) => any,
  setStateAction: (status: AsyncThunkStatus) => any,
  getPrevData: () => TimestampConvertedDocumentMap<T>,
  dispatch: Dispatch
) => {
  const callback: (data: T[]) => Promise<void> = async (data: T[]) => {
    try {
      dispatch(setStateAction("loading"));
      const filteredData = filterDataFunction(userId, data);
      const newData = arrayToDictWithTimestampToNumbers(filteredData);
      const prevData = getPrevData();
      dispatch(setDataAction({ ...prevData, ...newData }));
      dispatch(setStateAction("success"));
    } catch (error) {
      console.error('Error in collection update callback:', error);
      dispatch(setStateAction("error"));
    }
  };

  try {
    dbInstance.addCollectionCallback(callback);
  } catch (error) {
    console.error("Failed to register collection callback:", error);
    dispatch(setStateAction("error"));
  }
};