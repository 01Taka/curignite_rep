import { DateRange } from "../../types/util/componentsTypes";
import { TimeSizeUnit } from "../../types/util/dateTimeTypes";
import { convertToDate, timeUnitToMilliseconds } from "./dateTimeUtils";
import { arrayToRanges } from "./rangeUtils";

export const dateArrayToRange = (dates: Date[], sizeUnit: TimeSizeUnit = 'days'): DateRange[] => {
  const millisPerUnitSize = timeUnitToMilliseconds(sizeUnit);

  // 日付を指定された時間単位で数値配列に変換
  const dateNumbers = dates.map(date => Math.floor(date.getTime() / millisPerUnitSize));

  // 数値範囲を日付範囲に変換
  return arrayToRanges(dateNumbers).map(({ min, max }) => ({
    start: convertToDate(min * millisPerUnitSize),
    end: convertToDate(max * millisPerUnitSize),
  }));
};

export const fillDateRange = (range: DateRange, unit: TimeSizeUnit): Date[] => {
  const unitInMillis = timeUnitToMilliseconds(unit);
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