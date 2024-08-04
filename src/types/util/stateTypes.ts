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
export type RequestStatus =
  | 'idle'           // 初期状態やリクエストが開始されていない状態
  | 'loading'        // リクエストが送信され、応答を待っている状態
  | 'success'        // リクエストが正常に完了した状態
  | 'error'          // リクエストが失敗した状態
  | 'notFound'       // リクエストが正常に完了したが、データが見つからなかった状態
  | 'updating'       // データが更新される途中の状態
  | 'cancelled'      // リクエストがキャンセルされた状態
  | 'partialSuccess' // リクエストが部分的に成功した状態
  | 'retrying';      // エラーが発生し、リクエストを再試行している状態
