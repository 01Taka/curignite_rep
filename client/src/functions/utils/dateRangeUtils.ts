import { DateRange } from "../../types/util/componentsTypes";
import { TimeSizeUnit } from "../../types/util/dateTimeTypes";
import { convertToDate } from "./dateTimeUtils";
import { arrayToRanges } from "./rangeUtils";
import { getMillisecondsPerUnit } from "./timeFormatUtils";

export const dateArrayToRange = (dates: Date[], sizeUnit: TimeSizeUnit = 'days'): DateRange[] => {
  const millisPerUnitSize = getMillisecondsPerUnit(sizeUnit);

  // 日付を指定された時間単位で数値配列に変換
  const dateNumbers = dates.map(date => Math.floor(date.getTime() / millisPerUnitSize));

  // 数値範囲を日付範囲に変換
  return arrayToRanges(dateNumbers).map(({ min, max }) => ({
    start: convertToDate(min * millisPerUnitSize),
    end: convertToDate(max * millisPerUnitSize),
  }));
};

export const fillDateRange = (range: DateRange, unit: TimeSizeUnit): Date[] => {
  const unitInMillis = getMillisecondsPerUnit(unit);
  const dates: Date[] = [];
  
  let currentDate = range.start.getTime();

  // 終了日のミリ秒
  const endDate = range.end.getTime();

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate += unitInMillis;
  }

  return dates;
};