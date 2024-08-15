/**
 * 配列を辞書に変換する関数
 * @param array - 配列データ
 * @returns ドキュメントIDをキーとする辞書
 */
export const arrayToDict = <T extends Object>(array: T[], key: keyof T): Record<keyof T, T> => {
  return array.reduce((acc, item) => {
    acc[key] = item;
    return acc;
  }, {} as Record<keyof T, T>);
};


/**
 * 辞書を配列に変換する関数
 * @param dict - ドキュメントIDをキーとする辞書
 * @returns 配列データ
 */
export const dictToArray = <T>(dict: Record<string, T>): T[] => {
  return Object.values(dict);
};

/**
 * 配列を指定されたキーに基づいてソートする関数
 * @param arr - ソート対象の配列
 * @param key - ソートするためのキー
 * @param ascending - 昇順かどうか
 * @returns ソートされた配列
 */
export const sortArray = <T>(arr: T[], key?: keyof T, ascending: boolean = true): T[] => {
  return arr.sort((a, b) => {
    const order = ascending ? 1 : -1;
    if (key) {
      return a[key] > b[key] ? order : a[key] < b[key] ? -order : 0;
    } else {
      return a > b ? order : a < b ? -order : 0;
    }
  });
};

/**
 * 辞書をキーまたは値に基づいてソートする関数
 * @param dict - ソート対象の辞書
 * @param sortBy - キーまたは値でソートするか
 * @param valueKey - ソートするための値のキー（値でソートする場合）
 * @param ascending - 昇順かどうか
 * @returns ソートされた辞書
 */
export const sortDict = <K extends string | number | symbol, V>(
  dict: Record<K, V>,
  sortBy: "key" | "value" = "key",
  valueKey?: keyof V,
  ascending: boolean = true
): Record<K, V> => {
  const compare = (a: unknown, b: unknown): number => {
    if (a === b) return 0;
    if (a == null) return -1; // null または undefined の場合は前にくる
    if (b == null) return 1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
    if (typeof a === "boolean" && typeof b === "boolean") return a === b ? 0 : a ? 1 : -1;
    return String(a).localeCompare(String(b));
  };

  const sortedEntries = Object.entries(dict).sort(([keyA, valueA], [keyB, valueB]) => {
    const order = ascending ? 1 : -1;

    if (sortBy === "key") {
      return compare(keyA, keyB) * order;
    } else if (valueKey && typeof valueA === "object" && typeof valueB === "object") {
      return compare((valueA as V)[valueKey], (valueB as V)[valueKey]) * order;
    } else {
      return compare(valueA, valueB) * order;
    }
  });

  return Object.fromEntries(sortedEntries) as Record<K, V>;
};

/**
 * 指定された順序に従って配列を並び替えます。
 * 
 * @param array - 並び替え対象の配列。
 * @param order - 並び替えに使用する順序を指定する配列。
 * @param orderKey - 並び替えの基準となるキー（オプション）。
 * @returns 並び替えられた配列。
 */
export const sortByOrder = <T>(array: T[], order: T[keyof T][], orderKey?: keyof T): T[] => {
  const groupedItems: Record<number, T[]> = {};

  if (!array) {
    return [];
  }

  array.forEach(item => {
    const value = orderKey ? item[orderKey] : (order.includes(item as any) ? item : null);
    const index = value !== null ? order.indexOf(value as T[keyof T]) : -1;

    if (!groupedItems[index]) {
      groupedItems[index] = [];
    }
    groupedItems[index].push(item);
  });

  const sortedArray = order.flatMap((_, index) => groupedItems[index] || []);
  
  return [...sortedArray, ...(groupedItems[-1] || [])];
};

/**
 * 配列から指定されたキーの最小値と最大値を取得する関数
 * @param array - 配列データ
 * @param key - 最小値と最大値を取得するためのキー
 * @returns 最小値と最大値のオブジェクト
 */
export const getMinAndMaxFromObjectArray = <T>(array: T[], key: keyof T): { min: T[keyof T], max: T[keyof T] } => {
  let min = array[0][key];
  let max = array[0][key];

  array.forEach((item) => {
    if (item[key] < min) min = item[key];
    if (item[key] > max) max = item[key];
  });

  return { min, max };
};

/**
 * オブジェクトのキーをその値に反映させる関数
 * @param obj - オブジェクトデータ
 * @returns ミラーされたキーと値のオブジェクト
 */
export type KeyMirrorObject<T> = { [K in keyof T]: K };

export const keyMirror = <T extends object>(obj: T): KeyMirrorObject<T> => {
  return Object.keys(obj).reduce((mirrored, key) => {
    mirrored[key as keyof T] = key as keyof T;
    return mirrored;
  }, {} as KeyMirrorObject<T>);
};

/**
 * 配列からnullとundefinedを取り除く関数
 * @param array - 入力配列
 * @returns フィルタリングされた配列
 */
export const removeNullAndUndefined = <T>(array: (T | null | undefined)[]): T[] => {
  return array.filter((item): item is T => item != null);
};

/**
 * 配列から指定されたプロパティで一意なデータを取得する関数
 * @param array - 配列データ
 * @param key - 一意性を決定するためのキー
 * @returns 一意な要素を含む配列
 */
export const uniqueByProperty = <T, K extends keyof T>(array: T[], key: K): T[] => {
  const uniqueMap = new Map<T[K], T>(array.map(item => [item[key], item]));
  return Array.from(uniqueMap.values());
};
