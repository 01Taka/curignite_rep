/**
 * エラーを処理し、適切なメッセージを返すユーティリティ関数
 * @param error - 捕捉されたエラー
 * @param messageTemplate - エラーメッセージテンプレート。{error} プレースホルダーを含むことができる
 * @returns エラーメッセージ
 */
export const formatApiErrorMessage = (error: unknown, messageTemplate: string): string => {
  let errorMessage: string;

  if (error instanceof Error) {
    // Error 型のエラー処理
    errorMessage = error.message;
  } else {
    // Error 型ではない場合の処理
    console.error('Unexpected error:', error);
    errorMessage = '予期しないエラーが発生しました';
  }

  // プレースホルダー {error} をエラーメッセージで置き換え
  return messageTemplate.replace(/{error}/g, errorMessage);
}
