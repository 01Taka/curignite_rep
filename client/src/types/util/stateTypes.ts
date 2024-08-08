export type AnonymousStatus =
    | "public"
    | "communityOnly"
    | "private"

export type AuthStates =
    | "verified"
    | "noUserData"
    | "new"

/**
 * RequestStatus represents the various states that an asynchronous request can be in.
 */
export enum RequestStatus {
  Idle = 'idle',             // 初期状態やリクエストが開始されていない状態
  Loading = 'loading',       // リクエストが送信され、応答を待っている状態
  Success = 'success',       // リクエストが正常に完了した状態
  Error = 'error',           // リクエストが失敗した状態
  NotFound = 'notFound',     // リクエストが正常に完了したが、データが見つからなかった状態
  Updating = 'updating',     // データが更新される途中の状態
  Cancelled = 'cancelled',   // リクエストがキャンセルされた状態
  PartialSuccess = 'partialSuccess', // リクエストが部分的に成功した状態
  Retrying = 'retrying',     // エラーが発生し、リクエストを再試行している状態
}

export type Device = "mobile" | "desktop";
