export const convertToString = (
  value: string | number | (string | number)[] | null | undefined,
  separator: string = ""
): string => {
  // 値が null や undefined の場合、空文字を返す
  if (value == null) return "";

  // 配列の場合、各要素を文字列化して結合
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(separator);
  }

  // それ以外の値は単純に文字列化
  return String(value);
};
