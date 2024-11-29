import { ParamReplace, PathParam } from "../../types/path/paths";

/**
 * パスのパラメータを置換する関数
 * @param path - パス文字列
 * @param params - パスのパラメータを置換するオブジェクト
 * @returns - 置換後のパス
 */
export const replaceParams = (path: string, params: ParamReplace): string => {
  Object.keys(params).forEach((param) => {
    path = path.replace(`:${param}`, params[param as PathParam] ?? `:${param}`);
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
export function getLastSegment(path: string, options?: Partial<{ wildcard: boolean, paramReplace: ParamReplace, startPosition: number }>): string {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new Error('パスは有効な文字列である必要があります');
  }

  // オプションのパラメータ置換を適用
  const replacedPath = options?.paramReplace ? replaceParams(path, options.paramReplace) : path;

  // 最後のスラッシュの位置を取得
  let lastSlashIndex = replacedPath.length - 1;

  for (let index = 0; index < Math.abs((options?.startPosition) ?? 1); index++) {
    lastSlashIndex = replacedPath.lastIndexOf('/', lastSlashIndex - 1);
    if (replacedPath[lastSlashIndex + 1] === ":") {
      index -= 1;
    }
  }
  
  // 最後のセグメントを取得
  let lastSegment = lastSlashIndex === -1 ? replacedPath : replacedPath.substring(lastSlashIndex + 1);

  return `${lastSegment}${options?.wildcard ? "/*" : ""}`;
}