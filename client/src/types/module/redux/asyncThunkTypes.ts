// 成功時の状態の型定義
export interface AsyncThunkDataState<T> {
  state: "success";
  value?: T;
}

export enum AsyncThunkStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

// 状態の統一
export type AsyncThunkState<T> =
  | { state: AsyncThunkStatus.IDLE, value?: null }
  | { state: AsyncThunkStatus.LOADING, value?: null }
  | AsyncThunkDataState<T>
  | { state: AsyncThunkStatus.ERROR; value: string };
