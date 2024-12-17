export const getRandomElement = <T>(array: T[]): T | undefined => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}


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

export const seq = (start: number, stop?: number, step: number = 1): number[] => {
  const actualStart = stop !== undefined ? start : 0;
  const actualEnd = stop !== undefined ? stop : start;

  if (step === 0) {
    throw new Error("step must not be zero");
  }

  const length = Math.floor(Math.abs(actualEnd - actualStart - 1) / step) + 1;

  return Array.from({ length }, (_, i) => actualStart + i * step);
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


export const toArray = <T>(value: T | T[]): T[] => {
  return Array.isArray(value) ? value : [value];
}