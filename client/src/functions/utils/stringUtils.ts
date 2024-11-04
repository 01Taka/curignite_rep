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

/**
 * 引数がオブジェクトの場合はJSON形式に変換し、それ以外の場合は文字列に変換して返します。
 *
 * @param input - 任意の型の入力値。
 * @returns 入力値を文字列またはJSON形式の文字列に変換した結果。
 */
export const convertToStringOrJson = (input: any): string => {
  if (typeof input === 'object' && input !== null) {
      return JSON.stringify(input);
  }
  return String(input);
}