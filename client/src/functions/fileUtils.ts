import { FileExtension } from "../types/util/utilTypes";

/**
 * ファイルパスまたは URL から拡張子を取得する関数
 * @param {string} url - ファイルパスまたは URL
 * @returns {string} - ファイルの拡張子（例: 'jpg', 'png'）
 */
export const getFileExtension = (url: string): FileExtension | '' => {
  // クエリパラメータとハッシュフラグメントを削除
  const trimmedUrl = url.split('?')[0].split('#')[0];

  // パーセントエンコードされたファイル名をデコード
  const decodedUrl = decodeURIComponent(trimmedUrl);

  // ドットで分割して拡張子を取得
  const parts = decodedUrl.split('.');
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() as FileExtension || '' : '';

  return Object.values(FileExtension).includes(extension as FileExtension) ? extension : '';
}