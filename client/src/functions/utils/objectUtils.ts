// import { StringNumber } from "../../types/util/utilTypes";
// import { performComparison } from "./utils";



// export const mapObjectArrayToKeyValue = <T extends Record<string, any>>(
//   array: T[],
//   keyField: keyof T,
//   valueField: keyof T,
//   transformKeyFunc: (key: T[keyof T]) => string = (key) => String(key)
// ): Record<string, T[keyof T]> => {
//   return array.reduce((acc, item) => {
//     acc[transformKeyFunc(item[keyField])] = item[valueField];
//     return acc;
//   }, {} as Record<string, T[keyof T]>);
// };

// export const omitField = <T extends Record<string, any>>(object: T, key: keyof T): Omit<T, typeof key> => {
//   const { [key]: _, ...rest } = object;
//   return rest;
// }

// /**
//  * 辞書をキーまたは値に基づいてソートする関数
//  * @param dict - ソート対象の辞書
//  * @param sortBy - キーまたは値でソートするか
//  * @param valueKey - ソートするための値のキー（値でソートする場合）
//  * @param ascending - 昇順かどうか
//  * @returns ソートされた辞書
//  */
// export const sortDict = <K extends string | number | symbol, V>(
//   dict: Record<K, V>,
//   sortBy: "key" | "value" = "key",
//   valueKey?: keyof V,
//   ascending: boolean = true
// ): Record<K, V> => {
//   const compare = (a: unknown, b: unknown): number => {
//     if (a === b) return 0;
//     if (a == null) return -1; // null または undefined の場合は前にくる
//     if (b == null) return 1;
//     if (typeof a === "number" && typeof b === "number") return a - b;
//     if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
//     if (typeof a === "boolean" && typeof b === "boolean") return a === b ? 0 : a ? 1 : -1;
//     return String(a).localeCompare(String(b));
//   };

//   const sortedEntries = Object.entries(dict).sort(([keyA, valueA], [keyB, valueB]) => {
//     const order = ascending ? 1 : -1;

//     if (sortBy === "key") {
//       return compare(keyA, keyB) * order;
//     } else if (valueKey && typeof valueA === "object" && typeof valueB === "object") {
//       return compare((valueA as V)[valueKey], (valueB as V)[valueKey]) * order;
//     } else {
//       return compare(valueA, valueB) * order;
//     }
//   });

//   return Object.fromEntries(sortedEntries) as Record<K, V>;
// };


// /**
//  * 配列から指定されたキーの最小値と最大値を取得する関数
//  * @param array - 配列データ
//  * @param key - 最小値と最大値を取得するためのキー
//  * @returns 最小値と最大値のオブジェクト
//  */
// export const getMinAndMaxFromObjectArray = <T, K extends number | string | Date>(
//   array: T[],
//   key: keyof T,
//   conversionFunctions?: (value: T[keyof T]) => K
// ): { min: T; max: T } | null=> {
//   array = array.filter(data => !!data[key]);

//   if (array.length === 0) {
//     console.log("Array must not be empty");
//     return null;
//   }

//   const getValue = (item: T) => {
//     return conversionFunctions ? conversionFunctions(item[key]) : item[key];
//   }

//   return array.reduce<{ min: T; max: T }>((acc, item) => {
//     const currentValue = getValue(item);
//     return {
//       min: currentValue < getValue(acc.min) ? item : acc.min,
//       max: currentValue > getValue(acc.max) ? item : acc.max,
//     };
//   }, { min: array[0], max: array[0] });
// };


// /**
//  * 与えられた `valueMap` から、指定された `value` に最も近いキーに対応する値を返します。
//  * `useUpper` によって、2つのキーの間で上限（大きい方）か下限（小さい方）のどちらの値を使用するかを決定します。
//  * 
//  * @template T - `valueMap` のキーの型。`string` または `number` が利用できます。
//  * @template K - `valueMap` の値の型。
//  * 
//  * @param valueMap - キーと値のマップ。キーは `string` または `number` で、値は任意の型です。
//  * @param value - 検索対象のキー。`valueMap` のキーの型と同じ型である必要があります。
//  * @param useUpper - true の場合、`value` より大きい最も近いキーの値を返し、false の場合は `value` 以下の最も近いキーの値を返します。
//  * @returns `value` に最も近いキーに対応する `valueMap` の値を返します。
//  */
// export const getValueBetween = <T extends number | string | StringNumber, K>(
//   valueMap: Record<T, K>, 
//   value: T, 
//   useUpper: boolean = false
// ): K | null=> {
//   let closestKey: T | null = null;
//   for (const key of Object.keys(valueMap) as T[]) {
//     if (useUpper) {
//       if (performComparison(key, value, ">=") && (closestKey === null || performComparison(key, closestKey, "<"))) {  
//         closestKey = key;
//       }
//     } else {
//       if (performComparison(key, value, "<=") && (closestKey === null || performComparison(key, closestKey, ">"))) {
//         closestKey = key;
//       }
//     }
//   }

//   if (closestKey === null) {
//     console.error('No suitable key found in valueMap.');
//     return null;
//   }

//   return valueMap[closestKey];
// };





// /**
//  * 指定されたキーに基づいてオブジェクトの配列から重複を除去します。
//  * 
//  * @param objects - 重複を除去する対象のオブジェクトの配列。
//  * @param key - 重複をチェックするために使用するオブジェクトのキー。
//  * @returns 重複が除去されたオブジェクトの配列。
//  */
// export const removeDuplicatesByKey = <T extends Record<string, any>>(objects: T[], key: keyof T): T[] => {
//   // 既に見た値を保存するためのセット
//   const seenValues = new Set<any>();

//   return objects.filter(object => {
//     const value = object[key];
//     if (seenValues.has(value)) {
//       return false;
//     }

//     seenValues.add(value);
//     return true;
//   });
// }



// /**
//  * オブジェクトのキーと値を持つオブジェクトの配列を返します。
//  *
//  * @param dict - キーと値のペアを持つオブジェクト。
//  * @returns キーとその値を含むオブジェクトの配列。
//  */
// export const convertDictToKeyValuePairs = <T extends Record<string, any>>(dict: T): { key: string; value: T[keyof T] }[] => {
//   return Object.entries(dict).map(([key, value]) => ({
//     key,
//     value,
//   }));
// };

// export const union = <T>(...setsOrArrays: (Set<T> | T[])[]): Set<T> => {
//   const sets = setsOrArrays.map(value => new Set(value));
//   return sets.reduce((acc, set) => new Set([...acc, ...set]), new Set<T>());
// }




// /**
//  * 配列から指定されたプロパティで一意なデータを取得する関数
//  * @param array - 配列データ
//  * @param key - 一意性を決定するためのキー
//  * @returns 一意な要素を含む配列
//  */
// export const uniqueByProperty = <T, K extends keyof T>(array: T[], key: K): T[] => {
//   const uniqueMap = new Map<T[K], T>(array.map(item => [item[key], item]));
//   return Array.from(uniqueMap.values());
// };



// export const distributeTargetByRatio = <T>(start: number, distr: number, ratios: number[], element: T[]): T[][] => {
//   const distribute = distributeByRatios(start, distr, ratios, element.length);
  
//   if (element.length === 0) return []; // エラーチェック
  
//   const result: T[][] = [];
//   let count = 0;

//   distribute.forEach((countForSegment) => {
//       result.push(element.slice(count, count + countForSegment));
//       count += countForSegment;
//   });

//   return result;
// };

// export const distributeByRatios = (start: number, distr: number, ratios: number[], element: number): number[] => {
//   // 結果リストを初期化
//   const result: number[] = Array(distr).fill(0);

//   // `ratios`を繰り返して、`distr`の長さの比率リストを作成
//   const def_ratios: number[] = Array.from({ length: distr }, (_, i) => ratios[(start + i) % ratios.length]);

//   // 合計比率を計算
//   const total_ratio = def_ratios.reduce((sum, ratio) => sum + ratio, 0);

//   // 各要素に基本的な割り当てを計算
//   for (let i = 0; i < distr; i++) {
//     result[i] = Math.floor((element * def_ratios[i]) / total_ratio);
//   }

//   // 余りの計算
//   const remaining = element - result.reduce((sum, value) => sum + value, 0);

//   // 余りを def_ratios の比率に基づいて分配
//   const indices = Array.from({ length: distr }, (_, i) => i)
//     .sort((a, b) => def_ratios[b] - def_ratios[a]);

//   // 残りの余りを比率の大きい順に1ずつ追加
//   for (let i = 0; i < remaining; i++) {
//     result[indices[i % distr]] += 1;
//   }

//   return result;
// }

export {}