import { StringNumber } from "../../types/util/utilTypes";
import { convertToStringOrJson } from "./stringUtils";
import { performComparison } from "./utils";

/**
 * 配列を辞書に変換する関数
 * @param array - 配列データ
 * @returns ドキュメントIDをキーとする辞書
 */
export const objectArrayToDict = <T extends Record<string, any>>(array: T[], key: keyof T): Record<string, T> => {
  return array.reduce((acc, item) => {
    acc[String(item[key])] = item;
    return acc;
  }, {} as Record<string, T>);
};

export const mapObjectArrayToKeyValue = <T extends Record<string, any>>(
  array: T[],
  keyField: keyof T,
  valueField: keyof T,
  transformKeyFunc: (key: T[keyof T]) => string = (key) => String(key)
): Record<string, T[keyof T]> => {
  return array.reduce((acc, item) => {
    acc[transformKeyFunc(item[keyField])] = item[valueField];
    return acc;
  }, {} as Record<string, T[keyof T]>);
};

export const omitField = <T extends Record<string, any>>(object: T, key: keyof T): Omit<T, typeof key> => {
  const { [key]: _, ...rest } = object;
  return rest;
}

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
 * @param ascending - 昇順かどうか
 * @returns ソートされた配列
 */
export const sortArray = <T>(arr: T[], ascending: boolean = true): T[] => {
  return arr.sort((a, b) => {
    if (a < b) return ascending ? -1 : 1;
    if (a > b) return ascending ? 1 : -1;
    return 0;
  });
}


export const sortObjectArray = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  ascending: boolean = true,
  nullsLast: boolean = true
): T[] => {
  return arr.sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    // 無効な値を扱う
    const isInvalidA = valueA === null || valueA === undefined;
    const isInvalidB = valueB === null || valueB === undefined;

    // 無効な値を先にするか後にするかの処理
    if (isInvalidA && isInvalidB) return 0;
    if (isInvalidA) return nullsLast ? 1 : -1;
    if (isInvalidB) return nullsLast ? -1 : 1;

    // 型が異なる場合の処理（stringとnumberの比較などを防ぐ）
    if (typeof valueA !== typeof valueB) {
      throw new Error('Inconsistent types in the array elements');
    }

    // ソートの処理
    const order = ascending ? 1 : -1;
    if (valueA > valueB) return order;
    if (valueA < valueB) return -order;

    return 0;
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
export const getMinAndMaxFromObjectArray = <T, K extends number | string | Date>(
  array: T[],
  key: keyof T,
  conversionFunctions?: (value: T[keyof T]) => K
): { min: T; max: T } | null=> {
  array = array.filter(data => !!data[key]);

  if (array.length === 0) {
    console.log("Array must not be empty");
    return null;
  }

  const getValue = (item: T) => {
    return conversionFunctions ? conversionFunctions(item[key]) : item[key];
  }

  return array.reduce<{ min: T; max: T }>((acc, item) => {
    const currentValue = getValue(item);
    return {
      min: currentValue < getValue(acc.min) ? item : acc.min,
      max: currentValue > getValue(acc.max) ? item : acc.max,
    };
  }, { min: array[0], max: array[0] });
};


/**
 * 与えられた `valueMap` から、指定された `value` に最も近いキーに対応する値を返します。
 * `useUpper` によって、2つのキーの間で上限（大きい方）か下限（小さい方）のどちらの値を使用するかを決定します。
 * 
 * @template T - `valueMap` のキーの型。`string` または `number` が利用できます。
 * @template K - `valueMap` の値の型。
 * 
 * @param valueMap - キーと値のマップ。キーは `string` または `number` で、値は任意の型です。
 * @param value - 検索対象のキー。`valueMap` のキーの型と同じ型である必要があります。
 * @param useUpper - true の場合、`value` より大きい最も近いキーの値を返し、false の場合は `value` 以下の最も近いキーの値を返します。
 * @returns `value` に最も近いキーに対応する `valueMap` の値を返します。
 */
export const getValueBetween = <T extends number | string | StringNumber, K>(
  valueMap: Record<T, K>, 
  value: T, 
  useUpper: boolean = false
): K | null=> {
  let closestKey: T | null = null;
  for (const key of Object.keys(valueMap) as T[]) {
    if (useUpper) {
      if (performComparison(key, value, ">=") && (closestKey === null || performComparison(key, closestKey, "<"))) {  
        closestKey = key;
      }
    } else {
      if (performComparison(key, value, "<=") && (closestKey === null || performComparison(key, closestKey, ">"))) {
        closestKey = key;
      }
    }
  }

  if (closestKey === null) {
    console.error('No suitable key found in valueMap.');
    return null;
  }

  return valueMap[closestKey];
};

/**
 * 配列から重複する要素を取り除く
 * @param array 重複を除去する対象の配列。
 * @returns 重複が除去された配列。
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
}

/**
 * 指定されたキーに基づいてオブジェクトの配列から重複を除去します。
 * 
 * @param objects - 重複を除去する対象のオブジェクトの配列。
 * @param key - 重複をチェックするために使用するオブジェクトのキー。
 * @returns 重複が除去されたオブジェクトの配列。
 */
export const removeDuplicatesByKey = <T extends Record<string, any>>(objects: T[], key: keyof T): T[] => {
  // 既に見た値を保存するためのセット
  const seenValues = new Set<any>();

  return objects.filter(object => {
    const value = object[key];
    if (seenValues.has(value)) {
      return false;
    }

    seenValues.add(value);
    return true;
  });
}

/**
 * 指定されたキーでオブジェクトの配列をグループ化します。
 *
 * @param objectArray - グループ化するオブジェクトの配列。
 * @param key - グループ化に使用するキー。
 * @returns グループ化されたオブジェクト。キーは指定されたキーの値、値はそのキーに関連するオブジェクトの配列。
 */
export const groupingByKey = <T extends Record<string, any>>(objectArray: T[], key: keyof T): Record<string, T[]> => {
  return objectArray.reduce((acc, obj) => {
      const groupKey = obj[key];

      // groupKeyがstringまたはJSON形式の文字列の場合を確認
      const validKey: string = convertToStringOrJson(groupKey);

      // validKeyが存在しない場合は新しい配列を作成
      if (!acc[validKey]) {
          acc[validKey] = [];
      }

      // 現在のオブジェクトをグループに追加
      acc[validKey].push(obj);
      return acc;
  }, {} as Record<string, T[]>);
};


/**
 * オブジェクトのキーと値を持つオブジェクトの配列を返します。
 *
 * @param dict - キーと値のペアを持つオブジェクト。
 * @returns キーとその値を含むオブジェクトの配列。
 */
export const convertDictToKeyValuePairs = <T extends Record<string, any>>(dict: T): { key: string; value: T[keyof T] }[] => {
  return Object.entries(dict).map(([key, value]) => ({
    key,
    value,
  }));
};

export const union = <T>(...setsOrArrays: (Set<T> | T[])[]): Set<T> => {
  const sets = setsOrArrays.map(value => new Set(value));
  return sets.reduce((acc, set) => new Set([...acc, ...set]), new Set<T>());
}

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

export const seq = (start: number, stop?: number, step: number = 1): number[] => {
  const actualStart = stop !== undefined ? start : 0;
  const actualEnd = stop !== undefined ? stop : start;

  if (step === 0) {
    throw new Error("step must not be zero");
  }

  const length = Math.floor(Math.abs(actualEnd - actualStart - 1) / step) + 1;

  return Array.from({ length }, (_, i) => actualStart + i * step);
};

export const splitArray = <T>(array: T[], m: number): T[][] => {
  if (!Array.isArray(array)) {
    console.error("配列ではない値が渡されました: ", array);
    return[]; 
  }

  if (m <= 0) {
    console.error('mには正の整数を指定してください: ', m);
    return[];
  }
  
  const result: T[][] = [];
  const len = array.length;
  const quotient = Math.floor(len / m); // 各部分配列の基本サイズ
  const remainder = len % m; // 余り

  let start = 0;
  for (let i = 0; i < m; i++) {
      // 余りがある場合、最初の remainder 個の部分配列に1つ多く配分
      const size = quotient + (i < remainder ? 1 : 0);
      result.push(array.slice(start, start + size));
      start += size;
  }

  return result;
}

export const distributeTargetByRatio = <T>(start: number, distr: number, ratios: number[], element: T[]): T[][] => {
  const distribute = distributeByRatios(start, distr, ratios, element.length);
  
  if (element.length === 0) return []; // エラーチェック
  
  const result: T[][] = [];
  let count = 0;

  distribute.forEach((countForSegment) => {
      result.push(element.slice(count, count + countForSegment));
      count += countForSegment;
  });

  return result;
};

export const distributeByRatios = (start: number, distr: number, ratios: number[], element: number): number[] => {
  // 結果リストを初期化
  const result: number[] = Array(distr).fill(0);

  // `ratios`を繰り返して、`distr`の長さの比率リストを作成
  const def_ratios: number[] = Array.from({ length: distr }, (_, i) => ratios[(start + i) % ratios.length]);

  // 合計比率を計算
  const total_ratio = def_ratios.reduce((sum, ratio) => sum + ratio, 0);

  // 各要素に基本的な割り当てを計算
  for (let i = 0; i < distr; i++) {
    result[i] = Math.floor((element * def_ratios[i]) / total_ratio);
  }

  // 余りの計算
  const remaining = element - result.reduce((sum, value) => sum + value, 0);

  // 余りを def_ratios の比率に基づいて分配
  const indices = Array.from({ length: distr }, (_, i) => i)
    .sort((a, b) => def_ratios[b] - def_ratios[a]);

  // 残りの余りを比率の大きい順に1ずつ追加
  for (let i = 0; i < remaining; i++) {
    result[indices[i % distr]] += 1;
  }

  return result;
}
