// 成功時の状態の型定義
export interface AsyncThunkDataState<T> {
  state: "success";
  value?: T;
}

// 状態の統一
export type AsyncThunkState<T> =
  | { state: "idle", value?: null }
  | { state: "loading", value?: null }
  | AsyncThunkDataState<T>
  | { state: "error"; value: string };

export type AsyncThunkStatus = "idle" | "loading" | "success" | "error";