import { ParamReplace, PathParam } from "../../types/path/paths";

/**
 * パスのパラメータを置換する関数
 * @param path - パス文字列
 * @param params - パスのパラメータを置換するオブジェクト
 * @returns - 置換後のパス
 */
export const replaceParams = (path: string, params: ParamReplace): string => {
  Object.keys(params).forEach((param) => {
    path = path.replace(`:${param}`, params[param as PathParam] || `:${param}`);
  });
  return path;
}

/**
 * 指定されたパスの最後のセグメント（最後のスラッシュの後ろの部分）を返す関数
 * オプションでパスパラメータを置換することもできます。
 * @param path - パス文字列
 * @param paramReplace - パスのパラメータを置換するオブジェクト
 * @returns - パスの最後のセグメント
 */
export function getLastSegment(path: string, paramReplace?: ParamReplace, wildcard: boolean = false): string {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new Error('パスは有効な文字列である必要があります');
  }

  // オプションのパラメータ置換を適用
  const replacedPath = paramReplace ? replaceParams(path, paramReplace) : path;

  // 最後のスラッシュの位置を取得
  const lastSlashIndex = replacedPath.lastIndexOf('/');
  
  // 最後のセグメントを取得
  let lastSegment = lastSlashIndex === -1 ? replacedPath : replacedPath.substring(lastSlashIndex + 1);

  // 最後のセグメントがパラメータの場合、その一つ前のセグメントも含める
  if (lastSegment.startsWith(":")) {
    const secondLastSlashIndex = replacedPath.lastIndexOf('/', lastSlashIndex - 1);
    if (secondLastSlashIndex !== -1) {
      lastSegment = replacedPath.substring(secondLastSlashIndex + 1);
    } else {
      lastSegment = replacedPath;
    }
  }

  return `${lastSegment}${wildcard ? "/*" : ""}`;
}