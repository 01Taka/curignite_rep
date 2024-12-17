/**
 * 配列から重複する要素を取り除く
 * @param array 重複を除去する対象の配列。
 * @returns 重複が除去された配列。
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
}