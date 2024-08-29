import { FileExtension } from "../types/util/utilTypes";

/**
 * ファイルパスまたは URL から拡張子を取得する関数
 * @param {string} path - ファイルパスまたは URL
 * @returns {string} - ファイルの拡張子（例: 'jpg', 'png'）
 */
export const getFileExtension = (path: string): FileExtension | '' => {
  const trimmedPath = path.split('?')[0].split('#')[0];
  const parts = trimmedPath.split('.');
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() as FileExtension || '' : '';
  
  return Object.values(FileExtension).includes(extension as FileExtension) ? extension : '';
}