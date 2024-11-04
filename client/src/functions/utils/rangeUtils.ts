import { Range } from "../../types/util/componentsTypes";
import { seq } from "./objectUtils";
import { RangeOptions } from "./rangeUtilsTypes";


export const getRange = (start: number, end: number): Range => {
  const [min, max] = end > start ? [start, end] : [end, start];
  return { min, max }
}

export const isSameRange = (...ranges: Range[]): boolean => {
  if (ranges.length < 2) {
    return true;
  }
  const [baseMin, baseMax] = [ranges[0].min, ranges[0].max];
  return ranges.every(range => range.min === baseMin && range.max === baseMax);
}

export const sumRanges = (ranges: Range[]): number => {
  return ranges.reduce((sum, { min, max }) => {
    // min と max が数値かどうかをチェックし、max が min 以上の場合のみ加算
    if (typeof min === 'number' && typeof max === 'number') {
      return sum + (max - min + 1);
    }
    return sum;
  }, 0);
};

export const arrayToRanges = (arr: number[]): Range[] => {
  // 重複を削除し、昇順にソート
  const sortedArray = [...new Set(arr)].sort((a, b) => a - b);

  // 範囲を格納する配列
  const ranges: Range[] = [];

  let start = sortedArray[0];
  let end: number | null = null;

  sortedArray.forEach((num) => {
    if (end === null || num === end + 1) {
      // 連続している場合、end を更新
      end = num;
    } else {
      // 連続していない場合、新しい範囲を追加
      ranges.push({ min: start, max: end });
      start = num;
      end = num;
    }
  });

  // 最後の範囲を追加
  if (end) {
    ranges.push({ min: start, max: end });
  }

  return ranges;
};

export const arrayToRangeString = (arr: number[], options: RangeOptions = {}): string => {
  if (arr.length === 0) return "";
  const { delimiter = ', ', unit = "", connection = '~' } = options;
  const ranges = arrayToRanges(arr);
  return rangesToString(ranges, { delimiter, unit, connection });
};

export const rangeToString = (range: Range, options: RangeOptions = {}): string => {
  const { unit = "", connection = '~' } = options;
  return range.min === range.max
    ? `${String(range.min)}${unit}`
    : `${range.min ?? ''}${connection}${range.max ?? ''}${unit}`;
};

export const rangesToString = (ranges: Range[], options: RangeOptions = {}): string => {
  if (ranges.length === 0) return "";
  const { delimiter = ', ', unit = "", connection = '~' } = options;
  return ranges
    .map(range => rangeToString(range, { unit, connection }))
    .join(delimiter);
};

export const rangesToArray = (ranges: Range[], includeMax: boolean = false): number[] => {
  const setRanges = new Set<number>();
  const mergedRanges = mergeRanges(ranges);
  mergedRanges.forEach(range => {
    const numbers = seq(range.min, range.max + Number(includeMax));
    numbers.forEach(number => setRanges.add(number));
  })
  return Array.from(setRanges);
}

export const isNumberInRange = (ranges: Range[] | Range, numberToCheck: number, includeMax: boolean = true): boolean => {
  const inRange = (min: number, max: number, value: number) => {
    return value >= min && (value < max || (includeMax && value === max));
  }
  return Array.isArray(ranges)
   ? ranges.some(range => inRange(range.min, range.max, numberToCheck))
   : inRange(ranges.min, ranges.max, numberToCheck);
}

export const mergeRanges = (ranges: Range[]): Range[] => {
  if (ranges.length === 0) return [];

  // minの昇順にソートする
  ranges.sort((a, b) => a.min - b.min);

  const result: Range[] = [];
  let currentRange = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
      const nextRange = ranges[i];

      // currentRangeとnextRangeが重なっている、または連続している場合
      if (currentRange.max >= nextRange.min - 1) {
          // 結合して currentRange を更新
          currentRange.max = Math.max(currentRange.max, nextRange.max);
      } else {
          // 結合できない場合、currentRangeを結果に追加し、nextRangeを新しいcurrentRangeにする
          result.push(currentRange);
          currentRange = nextRange;
      }
  }

  // 最後のcurrentRangeを結果に追加
  result.push(currentRange);

  return result;
}