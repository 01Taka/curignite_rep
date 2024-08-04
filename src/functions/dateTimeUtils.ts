import { format, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInYears } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { DecimalDigits } from '../types/util/componentsTypes';

type TimeTypes = number | Timestamp | Date;

const SECONDS_IN_MILLISECOND = 1000;
const MINUTES_IN_MILLISECOND = SECONDS_IN_MILLISECOND * 60;
const HOURS_IN_MILLISECOND = MINUTES_IN_MILLISECOND * 60;
const DAYS_IN_MILLISECOND = HOURS_IN_MILLISECOND * 24;
const YEARS_IN_MILLISECOND = DAYS_IN_MILLISECOND * 365;

interface RelativeFormat {
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
    years: string;
    maxUnit: UnitType;
    minUnit?: UnitType;
}

const absoluteFormatItems = ["y", "M", "d", "H", "m", "s"]

interface FormatRange<T extends boolean> {
    unit: UnitType;
    value: number;
    format: T extends true ? string : Partial<RelativeFormat>;
    absolute: T;
    truncate?: boolean;
}

type UnitType = "millis" | "seconds" | "minutes" | "hours" | "days" | "years";

/**
 * 指定された時間単位の値をミリ秒に変換する。
 * @param unit - 時間の単位。
 * @param value - 変換する値。
 * @returns ミリ秒に相当する値。
 */
const toMillis = (unit: UnitType, value: number): number => {
    switch (unit) {
        case "millis":
            return value;
        case "seconds":
            return value * SECONDS_IN_MILLISECOND;
        case "minutes":
            return value * MINUTES_IN_MILLISECOND;
        case "hours":
            return value * HOURS_IN_MILLISECOND;
        case "days":
            return value * DAYS_IN_MILLISECOND;
        case "years":
            return value * YEARS_IN_MILLISECOND;
        default:
            throw new Error(`Invalid unit type: ${unit}`);
    }
};

/**
 * TimeTypes の入力を Date オブジェクトに変換する。
 * @param input - 変換する入力（数値、Timestamp、または Date）。
 * @returns 対応する Date オブジェクト。
 */
const toDate = (input: TimeTypes): Date => {
    if (input instanceof Timestamp) {
        return input.toDate();
    } else if (input instanceof Date) {
        return input;
    } else if (typeof input === 'number') {
        return new Date(input);
    } else {
        throw new Error('Invalid input type. Must be number, Timestamp, or Date.');
    }
};


/**
 * TimeTypes の入力を Timestamp オブジェクトに変換する。
 * @param input - 変換する入力（数値、Timestamp、または Date）。
 * @returns 対応する Timestamp オブジェクト。
 */
/*const toTimestamp = (input: TimeTypes): Timestamp => {
    if (input instanceof Timestamp) {
        return input;
    } else if (input instanceof Date) {
        return Timestamp.fromDate(input);
    } else if (typeof input === 'number') {
        return Timestamp.fromMillis(input);
    } else {
        throw new Error('Invalid input type. Must be number, Timestamp, or Date.');
    }
};*/

/**
 * TimeTypes の入力を特定のフォーマットで文字列に変換する。
 * @param dateTime - フォーマットする日付/時間の入力。
 * @param formats - フォーマット文字列（デフォルトは 'yyyy-MM-dd HH:mm:ss'）。
 * @returns フォーマットされた日付文字列。
 */
const absoluteDateString = (dateTime: TimeTypes, formats: string = 'yyyy-MM-dd HH:mm:ss'): string => {
    // フォーマット文字列に有効なフォーマット項目が含まれているかを検証
    const isValidFormat = absoluteFormatItems.some(item => formats.includes(item));
    if (!isValidFormat) {
        return "";
    }

    // 入力をDate型に変換してフォーマット
    try {
        return format(toDate(dateTime), formats);
    } catch (error) {
        console.error('Invalid date input:', error);
        return "";
    }
};

/**
 * 2つの日付の差に基づいて相対的な日付文字列を生成する。
 * @param timestamp - 比較するタイムスタンプ。
 * @param formats - 相対的な文字列のフォーマット。
 * @param baseDate - 比較対象の日付（デフォルトは現在）。
 * @returns 相対的な日付文字列。
 */
const relativeDateString = (
    timestamp: TimeTypes,
    formats: Partial<RelativeFormat> = {},
    baseDate: TimeTypes = new Date(),
): string => {
    const date = toDate(timestamp);
    const base = toDate(baseDate);

    const diff = {
        seconds: differenceInSeconds(base, date),
        minutes: differenceInMinutes(base, date),
        hours: differenceInHours(base, date),
        days: differenceInDays(base, date),
        years: differenceInYears(base, date)
    };

    const defaultFormats: RelativeFormat = {
        seconds: '秒',
        minutes: '分',
        hours: '時間',
        days: '日',
        years: '年',
        maxUnit: "days",
        ...formats
    };

    const units: UnitType[] = ["seconds", "minutes", "hours", "days", "years"];
    const maxUnitIndex = units.indexOf(defaultFormats.maxUnit);
    const minUnitIndex = units.indexOf(defaultFormats.minUnit || "seconds");

    let result = '';

    for (let i = maxUnitIndex; i >= minUnitIndex; i--) {
        const unit = units[i] as keyof typeof diff;
        const value = diff[unit];
        const format = defaultFormats[unit];

        if (value > 0 && (i === maxUnitIndex || value % (i === minUnitIndex ? 1 : units[i - 1] === "years" ? 365 : 24) > 0)) {
            result += `${value % (i === minUnitIndex ? 1 : units[i - 1] === "years" ? 365 : 24)}${format}`;
        }
    }

    return result;
};

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

/**
 * 現在から見た過去の日時を取得し、オプションで切り捨てる。
 * @param unit - 時間の単位。
 * @param value - 過去の時間の値。
 * @param truncate - 日時を切り捨てるかどうか（デフォルトは false）。
 * @returns 過去の日時の Date オブジェクト。
 */
/*
const getPastTime = (unit: UnitType, value: number, truncate?: boolean): Date => {
    const currentTime = new Date();
    let pastTime: Date;

    switch (unit) {
        case "millis":
            pastTime = new Date(currentTime.getTime() - value);
            break;
        case "seconds":
            pastTime = subSeconds(currentTime, value);
            break;
        case "minutes":
            pastTime = subMinutes(currentTime, value);
            break;
        case "hours":
            pastTime = subHours(currentTime, value);
            break;
        case "days":
            pastTime = subDays(currentTime, value);
            break;
        case "years":
            pastTime = subYears(currentTime, value);
            break;
        default:
            throw new Error(`Invalid unit type: ${unit}`);
    }

    if (truncate) {
        switch (unit) {
            case "millis":
            case "seconds":
                return startOfMinute(pastTime);
            case "minutes":
                return startOfHour(pastTime);
            case "hours":
                return startOfDay(pastTime);
            case "days":
            case "years":
                return startOfYear(pastTime);
            default:
                return pastTime;
        }
    }

    return pastTime;
};*/

/**
 * 日付/時間を一連のフォーマットと条件に基づいて文字列に変換する。
 * @param dateTime - 日付/時間の入力。
 * @param defaultFormat - デフォルトのフォーマット文字列。
 * @param defaultAbsolute - デフォルトで絶対フォーマットを使用するかどうか。
 * @param formatRange - フォーマットと条件の範囲。
 * @returns フォーマットされた日付/時間文字列。
 */
export const dateTimeToString = <T>(
    dateTime: TimeTypes,
    defaultFormat: T extends true ? string : Partial<RelativeFormat>,
    defaultAbsolute: T,
    formatRange?: FormatRange<boolean>[]
): string => {
    const date = toDate(dateTime);
    const now = new Date();
    const diffMillis = now.getTime() - date.getTime();

    if (formatRange) {
        formatRange?.sort((a, b) => toMillis(a.unit, a.value) - toMillis(b.unit, b.value));

        for (const range of formatRange) {
            if (diffMillis <= toMillis(range.unit, range.value)) {
                if (range.absolute) {
                    return absoluteDateString(date, range.format as string);
                } else {
                    return relativeDateString(date, range.format as Partial<RelativeFormat>);
                }
            }
        }
    }

    return defaultAbsolute ? absoluteDateString(date, defaultFormat as string) : relativeDateString(date, defaultFormat as Partial<RelativeFormat>);
};
