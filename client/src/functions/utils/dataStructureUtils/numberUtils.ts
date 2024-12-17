/**
 * 値が数値に変換できる場合は数値に変換し、できない場合はそのまま返す関数
 * @param value - 変換する値
 * @returns 数値に変換可能であれば数値、それ以外はそのままの値
 */
export const convertToNumberIfPossible = <T>(value: T): T | number => {
  const num = Number(value);
  return isNaN(num) ? value : num;
};
