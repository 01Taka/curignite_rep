import { Timestamp } from "firebase/firestore";

export type Month = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12";
export type Days = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "24" | "25" | "26" | "27" | "28" | "29" | "30" | "31";
export type ISODate = `${string}-${Month}-${Days}`;
export type ISODateTime = `${ISODate}T${string}Z`

export const SECONDS_IN_MILLISECOND = 1000;
export const MINUTES_IN_MILLISECOND = SECONDS_IN_MILLISECOND * 60;
export const HOURS_IN_MILLISECOND = MINUTES_IN_MILLISECOND * 60;
export const DAYS_IN_MILLISECOND = HOURS_IN_MILLISECOND * 24;
export const YEARS_IN_MILLISECOND = DAYS_IN_MILLISECOND * 365;

export const DIGIT_SIZE: Record<TimeSizeUnit, number> = {
  millis: 1000,
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 365,
  years: 1,
};

export type TimeTypes = number | Timestamp | Date;

export type TimeSizeUnit = "millis" | "seconds" | "minutes" | "hours" | "days" | "years";

export interface FormatBase {
    truncateNotReachDigit?: boolean;
    endingUnit?: string;
    isAbsolute: boolean;
}

export interface RelativeFormat extends FormatBase {
    units: {
        seconds: string;
        minutes: string;
        hours: string;
        days: string;
        years: string;
    };
    conversion: {
        maxConvertTimeSizeUnit?: TimeSizeUnit;
        minTruncateTimeSizeUnit?: TimeSizeUnit;
    };
    baseDateTime?: TimeTypes;
    countUpTime?: boolean,
    isAbsolute: false;
}

export interface AbsoluteFormat extends FormatBase {
    format: string;
    isAbsolute: true;
}

export const absoluteFormatItems = ["y", "M", "d", "H", "m", "s"];

export type Format = Partial<RelativeFormat> | AbsoluteFormat;

export interface FormatChange {
    borderDateTime: number;
    borderUnit: TimeSizeUnit;
    format: Format;
}
