import { differenceInDays } from "date-fns";
import { MINUTES_IN_MILLISECOND, TIME_UNIT_IN_MILLISECONDS } from "../../constants/utils/dateTimeConstants";
import { DecimalDigits } from "../../types/util/componentsTypes";
import { TimeSizeUnit, TimeTypes } from "../../types/util/dateTimeTypes";
import { getMidnightDate } from "./dateTimeUtils";


/**
 * ミリ秒をフォーマットされた時間文字列に変換する。
 * @param millis - 変換するミリ秒。
 * @param decimalDigits - 含める小数桁数（デフォルトは0）。
 * @param flexMin - 分を柔軟に表示するかどうか（デフォルトは false）。
 * @returns フォーマットされた時間文字列。
 */
export const millisToTime = (millis: number, decimalDigits: DecimalDigits = 0, flexMin: boolean = false): string => {
  const totalSec = millis / 1000;
  const sec = Math.floor(totalSec % 60);
  const min = Math.floor((totalSec / 60) % 60);
  const hours = Math.floor(totalSec / 3600);

  const formattedSec = sec.toString().padStart(2, '0');
  const formattedMin = (!flexMin || min > 0) ? `${min.toString().padStart(2, '0')} : ` : "";
  const formattedHours = hours > 0 ? `${hours.toString()} : ` : "";

  const fractionalPart = decimalDigits > 0
      ? `.${((millis % 1000) / 1000).toFixed(decimalDigits).slice(2)}`
      : '';

  return `${formattedHours}${formattedMin}${formattedSec}${fractionalPart}`;
};

export const msToTime = (ms: number, hideSeconds: boolean = true, hideZeroHour: boolean = true): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hideZeroHour && hours === 0 ? "" : `${hours}時間`}${minutes.toString().padStart(2, '0')}分${hideSeconds ? "" : `${seconds}秒`}`;
}

export const splitMillis = (ms: number): { millis: number, seconds: number, minutes: number, hours: number } => {
  const millis = ms % 1000;
  const seconds = Math.floor((ms % 60000) / 1000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const hours = Math.floor(ms / 3600000);

  
  return { millis, seconds, minutes, hours };
}

export const splitMillisWithFormat = (
  ms: number, 
  options?: Partial<{ millsDigit: number; hoursDigit: number; hideZeroHours: boolean }>
) => {
  const { millis, seconds, minutes, hours } = splitMillis(ms);
  const { millsDigit, hoursDigit, hideZeroHours } = {
    ...{ millsDigit: 2, hoursDigit: 2, hideZeroHours: false }, ...options
  };

  // ミリ秒、秒、分、時間をゼロ埋めしてフォーマット
  const formattedMills = `${millis}`.padStart(millsDigit, '0');
  const formattedMinutes = `${minutes}`.padStart(2, '0');
  const formattedSeconds = `${seconds}`.padStart(2, '0');

  // 時間部分をフォーマット
  let formattedHours = '';
  if (!hideZeroHours || hours > 0) {
    formattedHours = `${hours}`.padStart(hoursDigit, '0');
  }

  return {
    millis: formattedMills,
    seconds: formattedSeconds,
    minutes: formattedMinutes,
    hours: formattedHours,
  };
};

export const timeOmissionFormat = (timeMs: number, options?: Partial<{ minutesUnit: string; hoursUnit: string; }>): string => {
  const minutesUnit = options?.minutesUnit ?? 'min';
  const hoursUnit = options?.hoursUnit ?? 'h';
  const minutes = Math.floor(timeMs / MINUTES_IN_MILLISECOND);
  const hours = (minutes / 60).toFixed(1);
  const unit = minutes >= 60 ? hoursUnit : minutesUnit;
  const value = minutes >= 60 ? hours : String(minutes);
  return `${value}${unit}`;
}


/**
 * 日付の差をフォーマットする関数
 * @param date - 比較対象の日付
 * @param format - 残りの日数が含まれるフォーマット
 * @param overFormat - 残りの日数がマイナスの場合のフォーマット
 * @param baseDate - 基準の日付（省略可能）
 * @returns フォーマットされた日付の差
 */
export const formatDateDifference = (
  date: TimeTypes,
  format: string = 'd日後',
  overFormat: string = 'd日前',
  baseDate: TimeTypes = new Date()
): string => {
  const remainingDays = differenceInDays(getMidnightDate(date), getMidnightDate(baseDate));
  const fom = remainingDays < 0 ? overFormat : format;
  return fom.replace(/d/g, String(Math.abs(remainingDays)))
};

// 名前を明確化し関数を簡略化
export const convertMilliseconds = (mills: number, unit: TimeSizeUnit = 'minutes'): number => {
  const unitInMillis = TIME_UNIT_IN_MILLISECONDS[unit];
  return Math.ceil(mills / unitInMillis);
};

export const getMillisecondsPerUnit = (unit: TimeSizeUnit): number => {
  return TIME_UNIT_IN_MILLISECONDS[unit];
};