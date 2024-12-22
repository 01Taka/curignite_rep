import { convertToStringOrJson } from "./stringUtils";

export const mergeObjects = <Key extends string | number | symbol, Value>(
  ...objects: Record<Key, Value>[]
): Record<string, Value[]> => {
  // すべてのオブジェクトのキーをフラットにし、重複を削除
  const uniqueKeys = [...new Set(objects.flatMap(object => Object.keys(object)))];

  // 結果オブジェクトを作成
  const result: Record<string, Value[]> = uniqueKeys.reduce((acc, key) => {
    acc[key] = [];  // 各キーに空の配列を初期化
    return acc;
  }, {} as Record<string, Value[]>);

  // 各オブジェクトを処理し、結果に値を追加
  objects.forEach(object => {
    Object.entries(object).forEach(([key, value]) => {
      result[key].push(...(Array.isArray(value) ? value : [value] as Value[]));
    });
  });

  return result;
};

export const mergeArrayValueObjects = <Key extends string | number | symbol, Value>(
  ...objects: Record<Key, Value[]>[]
): Record<string, Value[]> => {
  // すべてのオブジェクトのキーをフラットにし、重複を削除
  const uniqueKeys = [...new Set(objects.flatMap(object => Object.keys(object)))];

  // 結果オブジェクトを作成
  const result: Record<string, Value[]> = uniqueKeys.reduce((acc, key) => {
    acc[key] = [];  // 各キーに空の配列を初期化
    return acc;
  }, {} as Record<string, Value[]>);

  // 各オブジェクトを処理し、結果に値を追加
  objects.forEach(object => {
    Object.entries(object).forEach(([key, value]) => {
      result[key].push(...value as Value[]);
    });
  });

  return result;
};

/**
 * 指定されたキーでオブジェクトの配列をグループ化します。
 *
 * @param objectArray - グループ化するオブジェクトの配列。
 * @param key - グループ化に使用するキー。
 * @returns グループ化されたオブジェクト。キーは指定されたキーの値、値はそのキーに関連するオブジェクトの配列。
 */
export const groupingByKey = <T extends Record<string, any>>(objectArray: T[], key: keyof T): Record<string, T[]> => {
  return objectArray.reduce((acc, obj) => {
      if (obj === undefined || obj === null) return acc
    
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

export const sortObjectArray = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  ascending: boolean = true,
  nullsLast: boolean = true,
  expectedType: "string" | "number" | "boolean" | null = null
): T[] => {
  if (arr.length === 0) return arr; // 空の配列が渡された場合はそのまま返す

  // 最初の要素の型を取得
  const realExpectedType = expectedType ?? typeof arr[0][key];

  return [...arr].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    // 型が一致しない場合はnullとみなす
    const isInvalidA = valueA === null || valueA === undefined || typeof valueA !== realExpectedType;
    const isInvalidB = valueB === null || valueB === undefined || typeof valueB !== realExpectedType;

    // 無効な値を先にするか後にするかの処理
    if (isInvalidA && isInvalidB) return 0;
    if (isInvalidA) return nullsLast ? 1 : -1;
    if (isInvalidB) return nullsLast ? -1 : 1;

    // ソートの処理（数値や文字列以外に対応）
    const order = ascending ? 1 : -1;

    // 数値や文字列の比較
    if (valueA > valueB) return order;
    if (valueA < valueB) return -order;

    return 0;
  });
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
 * 与えられた値の配列を、指定された`map`の範囲に基づいてフィルタリングし、
 * 範囲内に含まれる値だけを返します。範囲に該当しない値がある場合は、`defaultValue`を返します。
 * 
 * @param values - フィルタリングする値の配列
 * @param map - 範囲の境界を指定する`Record`型オブジェクト。キーは範囲の境界値、値はその範囲に対応する任意の値。
 * @param defaultValue - 範囲に該当しない値に設定するデフォルト値。範囲外の値が見つかった場合に使用されます。
 * 
 * @returns 範囲内に該当する値のみを含む配列。範囲外の値は`defaultValue`が指定されていればその値が追加され、
 *          指定されていない場合は除外されます。
 */
export const mapValuesByRange = <K extends string | number, T>(
  values: (K)[],
  map: Record<K, T>,
  defaultValue: T
): T[] => {
  // `map`をソート済みのエントリリストに変換
  const mapEntries = Object.entries(map)
    .map(([key, value]) => [key, value] as [K, T])
    .sort((a, b) => {
      if (typeof a[0] === "number" && typeof b[0] === "number") {
        return a[0] - b[0];
      } else {
        return String(a[0]).localeCompare(String(b[0]));
      }
    });

  const result: T[] = [];

  values.forEach(value => {
    // 二分探索で`value`の範囲を特定
    let left = 0;
    let right = mapEntries.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (
        (typeof mapEntries[mid][0] === "number" && typeof value === "number" && mapEntries[mid][0] <= value) ||
        (typeof mapEntries[mid][0] === "string" && String(mapEntries[mid][0]) <= String(value))
      ) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // 範囲内の値かどうかを確認
    const lowerBound = mapEntries[left - 1]?.[0];
    const upperBound = mapEntries[left]?.[0];

    const isNumeric = typeof lowerBound === "number" && typeof value === "number" && typeof upperBound === "number";

    const isInRange =
      lowerBound !== undefined &&
      upperBound !== undefined &&
      ((isNumeric && lowerBound <= value && value < upperBound) ||
        (typeof lowerBound === "string" && typeof value === "string" && lowerBound <= value && value < upperBound));

    if (isInRange) {
      result.push(mapEntries[left - 1]?.[1] ?? defaultValue);
    } else {
      result.push(defaultValue);
    }
  });

  return result;
};
