import { format, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInYears, subSeconds, subMinutes, subHours, subDays, subYears, startOfMinute, startOfHour, startOfDay, startOfYear } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { DecimalDigits } from '../types/util/componentsTypes';
import { AbsoluteFormat, absoluteFormatItems, Days, DAYS_IN_MILLISECOND, DIGIT_SIZE, Format, FormatChange, HOURS_IN_MILLISECOND, ISODate, ISODateTime, MINUTES_IN_MILLISECOND, RelativeFormat, SECONDS_IN_MILLISECOND, TimeSizeUnit, TimeTypes, YEARS_IN_MILLISECOND } from '../types/util/dateTimeTypes';

export const isMatchDay = (date: TimeTypes, targetDay: Days = "01") => {
    return `${format(toDate(date), "dd")}` === targetDay;
}

export const isEqualDate = (...days: TimeTypes[]): boolean => {
    const check = convertToMilliseconds(startOfDay(toDate(days[0])))
    const isDiff = days.some(day => check !== convertToMilliseconds(startOfDay(toDate(day))));
    return !isDiff;
}

export const toISODate = (dateTime: TimeTypes): ISODate => {
    const date = toDate(dateTime).toISOString();
    return date.slice(0, 10) as ISODate;
}

export const toISODateTime = (dateTime: TimeTypes): ISODateTime => {
    const date = toDate(dateTime).toISOString();
    return date as ISODateTime;
}

export const convertToMilliseconds = (time: TimeTypes): number => {
    if (typeof time === 'number') {
        return time;
    } else if (time instanceof Date) {
        return time.getTime();
    } else if (time instanceof Timestamp) {
        return time.toMillis();
    } else {
        throw new Error('Unsupported time type');
    }
}

/**
 * 指定された時間単位の値をミリ秒に変換する。
 * @param unit - 時間の単位。
 * @param value - 変換する値。
 * @returns ミリ秒に相当する値。
 */
const toMillis = (unit: TimeSizeUnit, value: number): number => {
    const unitToMillisMap: Record<TimeSizeUnit, number> = {
        millis: value,
        seconds: value * SECONDS_IN_MILLISECOND,
        minutes: value * MINUTES_IN_MILLISECOND,
        hours: value * HOURS_IN_MILLISECOND,
        days: value * DAYS_IN_MILLISECOND,
        years: value * YEARS_IN_MILLISECOND,
    };

    return unitToMillisMap[unit];
};


/**
 * TimeTypes の入力を Date オブジェクトに変換する。
 * @param input - 変換する入力（数値、Timestamp、または Date）。
 * @returns 対応する Date オブジェクト。
 */
export const toDate = (input: TimeTypes): Date => {
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
export const toTimestamp = (input: TimeTypes): Timestamp => {
    return Timestamp.fromDate(toDate(input));
}

/**
 * 特定の日付の0時0分のタイムスタンプを返します。
 * @param date 対象の日付
 * @returns 0時0分のタイムスタンプ
 */
export const getMidnightTimestamp = (date: TimeTypes = new Date()): Timestamp => {
    const midnight = startOfDay(toDate(date));
    return Timestamp.fromDate(midnight);
};

/**
 * TimeTypes の入力を特定のフォーマットで文字列に変換する。
 * @param dateTime - フォーマットする日付/時間の入力。
 * @param absoluteFormat - フォーマットオプション
 * @returns フォーマットされた日付文字列。
 */
const formatDateAsAbsolute = (dateTime: TimeTypes, absoluteFormat: AbsoluteFormat): string => {
    const isValidFormat = absoluteFormatItems.some(item => absoluteFormat.format.includes(item));
    if (!isValidFormat) {
        return "";
    }

    const date = toDate(dateTime);

    try {
        let formattedDate = format(date, absoluteFormat.format);

        if (absoluteFormat.truncateNotReachDigit) {
            const nonZeroUnits = /[1-9]/;
            formattedDate = formattedDate
                .split(/(\d+)/)
                .map(part => (nonZeroUnits.test(part) || isNaN(Number(part)) || Number(part) !== 0) ? part : '')
                .join('')
                .trim();
        }

        if (absoluteFormat.endingUnit) {
            formattedDate += ` ${absoluteFormat.endingUnit}`;
        }

        return formattedDate;
    } catch (error) {
        console.error('Invalid date input:', error);
        return "";
    }
};

/**
 * 2つの日付の差に基づいて相対的な日付文字列を生成する。
 * @param timestamp - 比較するタイムスタンプ。
 * @param relativeFormat - 相対的な文字列のフォーマット。
 * @param baseDate - 比較対象の日付（デフォルトは現在）。
 * @returns 相対的な日付文字列。
 */
const formatDateAsRelative = (
    timestamp: TimeTypes,
    relativeFormat: Partial<RelativeFormat> = {},
): string => {
    const date = toDate(convertToMilliseconds(timestamp) * (relativeFormat.countUpTime ? -1 : 1));
    const base = toDate(relativeFormat.baseDateTime ?? (relativeFormat.countUpTime ? 0 : new Date()));

    const diff = {
        seconds: differenceInSeconds(base, date),
        minutes: differenceInMinutes(base, date),
        hours: differenceInHours(base, date),
        days: differenceInDays(base, date),
        years: differenceInYears(base, date)
    };

    const defaultFormats: RelativeFormat = {
        units: {
            seconds: '秒',
            minutes: '分',
            hours: '時間',
            days: '日',
            years: '年',
        },
        conversion: {
            maxConvertTimeSizeUnit: "days",
            minTruncateTimeSizeUnit: "seconds",
        },
        isAbsolute: false,
        ...relativeFormat
    };

    const units: TimeSizeUnit[] =  ["years", "days", "hours", "minutes", "seconds"];
    const maxUnitIndex = units.indexOf(defaultFormats.conversion.maxConvertTimeSizeUnit || "days");
    const minUnitIndex = units.indexOf(defaultFormats.conversion.minTruncateTimeSizeUnit || "seconds");

    const formattedParts = units.slice(maxUnitIndex, minUnitIndex + 1)
        .map((unit, index) => {
            const value = diff[unit as keyof typeof diff] % (index === 0 ? Infinity : DIGIT_SIZE[unit]);
            const format = defaultFormats.units[unit as keyof typeof defaultFormats.units];
            return (defaultFormats.truncateNotReachDigit && value === 0) ? '' : `${value}${format}`;
        })
        .filter(Boolean);

    let result = formattedParts.join(' ').trim();

    if (defaultFormats.endingUnit) {
        result += ` ${defaultFormats.endingUnit}`;
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
const getPastTime = (unit: TimeSizeUnit, value: number, truncate: boolean = false): Date => {
    const currentTime = new Date();
    const unitToSubMap: Record<TimeSizeUnit, (date: Date, amount: number) => Date> = {
        millis: (date, amount) => new Date(date.getTime() - amount),
        seconds: subSeconds,
        minutes: subMinutes,
        hours: subHours,
        days: subDays,
        years: subYears,
    };

    const pastTime = unitToSubMap[unit](currentTime, value);

    if (truncate) {
        const unitToStartMap: Record<TimeSizeUnit, (date: Date) => Date> = {
            millis: startOfMinute,
            seconds: startOfMinute,
            minutes: startOfHour,
            hours: startOfDay,
            days: startOfYear,
            years: startOfYear,
        };

        return unitToStartMap[unit](pastTime);
    }

    return pastTime;
};

/**
 * 日付/時間を一連のフォーマットと条件に基づいて文字列に変換する。
 * @param dateTime - 日付/時間の入力。
 * @param defaultFormat - デフォルトのフォーマット文字列。
 * @param formatChanges - フォーマットと条件の範囲。
 * @returns フォーマットされた日付/時間文字列。
 */
export const dateTimeToString = (
    dateTime: TimeTypes,
    defaultFormat: Format,
    formatChanges?: FormatChange[]
): string => {
    const date = toDate(dateTime);

    if (formatChanges) {
        formatChanges.sort((a, b) => toMillis(a.borderUnit, a.borderDateTime) - toMillis(b.borderUnit, b.borderDateTime));

        for (const formatChange of formatChanges) {
            if (date.getTime() < getPastTime(formatChange.borderUnit, formatChange.borderDateTime, formatChange.format.truncateNotReachDigit).getTime()) {
                if (formatChange.format.isAbsolute) {
                    return `${formatDateAsAbsolute(date, formatChange.format)}${formatChange.format.endingUnit ?? ""}`;
                } else {
                    return `${formatDateAsRelative(date, formatChange.format)}${formatChange.format.endingUnit ?? ""}`;
                }
            }
        }
    }

    return (
        `${defaultFormat.isAbsolute ? formatDateAsAbsolute(date, defaultFormat)
        : formatDateAsRelative(date, defaultFormat)}
        ${defaultFormat.endingUnit ?? ""}`
    );
};
