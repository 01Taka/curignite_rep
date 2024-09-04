import { format, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInYears, subSeconds, subMinutes, subHours, subDays, subYears, startOfMinute, startOfHour, startOfDay, startOfYear, isSameMinute } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { DecimalDigits } from '../types/util/componentsTypes';
import { AbsoluteFormat, absoluteFormatItems, Days, DIGIT_SIZE, Format, FormatChange, ISODate, ISODateTime, RelativeFormat, TimeSizeUnit, TimeTypes } from '../types/util/dateTimeTypes';
import { DAYS_IN_MILLISECOND, HOURS_IN_MILLISECOND, MINUTES_IN_MILLISECOND, SECONDS_IN_MILLISECOND, YEARS_IN_MILLISECOND } from '../constants/utils/dateTimeConstants';

export const isMidnight = (dateTime: TimeTypes) => {
    const date = convertToDate(dateTime);
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0);
    return isSameMinute(date, midnight);
}

export const isMatchDay = (date: TimeTypes, targetDay: Days | Days[]) => {
    const formatDate = format(convertToDate(date), "dd") as Days;
    return typeof targetDay === "string" ? formatDate === targetDay : targetDay.includes(formatDate); 
}

export const isEqualDate = (...days: TimeTypes[]): boolean => {
    const check = convertToMilliseconds(startOfDay(convertToDate(days[0])))
    const isDiff = days.some(day => check !== convertToMilliseconds(startOfDay(convertToDate(day))));
    return !isDiff;
}

/**
 * 比較対象の日付が基準の日付よりも過去かを判断する
 * @param baseDateTime - 基準となる日付と時間
 * @param targetDateTime - 比較対象の日付と時間
 * @param includesEqual - 基準日付と等しい場合も含めるかどうか
 * @returns 比較結果（ターゲット日付が基準日付よりも過去の場合はtrue、そうでない場合はfalse）
 */
export const isBeforeDateTime = (baseDateTime: TimeTypes, targetDateTime: TimeTypes, includesEqual: boolean = false) => {
    const baseMillis = convertToMilliseconds(baseDateTime);
    const targetMillis = convertToMilliseconds(targetDateTime);
    return includesEqual ? baseMillis >= targetMillis : baseMillis > targetMillis;
}

export const toISODate = (dateTime: TimeTypes): ISODate => {
    const date = convertToDate(dateTime).toISOString();
    return date.slice(0, 10) as ISODate;
}

export const toISODateTime = (dateTime: TimeTypes): ISODateTime => {
    const date = convertToDate(dateTime).toISOString();
    return date as ISODateTime;
}

/**
 * ISO形式の日付文字列をDateオブジェクトに変換します。
 * @param isoDate - ISO形式の日付文字列
 * @returns - 有効なDateオブジェクト、無効な場合はnull
 */
function parseISODate(isoDate: ISODate): Date | null {
    const date = new Date(`${isoDate}T00:00:00Z`);
    return isNaN(date.getTime()) ? null : date;
}

/**
 * ISO形式の日時文字列をDateオブジェクトに変換します。
 * @param isoDateTime - ISO形式の日時文字列
 * @returns - 有効なDateオブジェクト、無効な場合はnull
 */
const parseISODateTime = (isoDateTime: ISODateTime): Date | null => {
    const date = new Date(isoDateTime);
    return isNaN(date.getTime()) ? null : date;
}

/**
 * 様々な形式の時間をミリ秒に変換します。
 * @param time - TimeTypesのいずれか
 * @returns - ミリ秒またはnull（無効な場合）
 */
export const convertToMilliseconds = (time: TimeTypes): number => {
    return convertToDate(time).getMilliseconds();
}

/**
 * ミリ秒をDateオブジェクトに変換します。
 * @param time - 時間の入力（数値、Date、Timestamp、ISO形式の文字列）
 * @returns - Dateオブジェクト
 * @throws - 無効な変換の場合にエラーをスローします
 */
export const convertToDate = (time: TimeTypes): Date => {
    if (typeof time === 'number') {
        return new Date(time);
    } 
    
    if (time instanceof Date) {
        return time;
    }
    
    if (time instanceof Timestamp) {
        return time.toDate();
    }
    
    // ISO形式の日時文字列の場合
    if (typeof time === 'string' && time.endsWith("Z")) {
        const date = parseISODateTime(time as ISODateTime);
        if (!date) {
            throw new Error(`Invalid ISODateTime string: ${time}`);
        }
        return date;
    }
    
    // ISO形式の日付文字列の場合
    if (typeof time === 'string') {
        const date = parseISODate(time as ISODate);
        if (!date) {
            throw new Error(`Invalid ISODate string: ${time}`);
        }
        return date;
    }

    throw new Error(`Unsupported time type: ${typeof time}`);
}

/**
 * TimeTypes の入力を Timestamp オブジェクトに変換する。
 * @param input - 変換する入力（数値、Timestamp、または Date）。
 * @returns 対応する Timestamp オブジェクト。
 */
export const toTimestamp = (input: TimeTypes): Timestamp => {
    const date = convertToDate(convertToMilliseconds(input) ?? 0);
    return Timestamp.fromDate(date);
}

/**
 * 特定の日付の0時0分のタイムスタンプを返します。
 * @param date 対象の日付
 * @returns 0時0分のタイムスタンプ
 */
export const getMidnightTimestamp = (date: TimeTypes = new Date()): Timestamp => {
    return Timestamp.fromDate(getMidnightDate(date));
};

export const getMidnightDate = (date: TimeTypes = new Date()): Date => {
    const midnight = startOfDay(convertToDate(date));
    return midnight;
}

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

    const date = convertToDate(dateTime);

    try {
        const formats = (absoluteFormat.formatAtMidnight && isMidnight(date))
        ? absoluteFormat.formatAtMidnight : absoluteFormat.format;

        let formattedDate = format(date, formats);

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
    const date = convertToDate(convertToMilliseconds(timestamp) * (relativeFormat.countUpTime ? -1 : 1));
    const base = convertToDate(relativeFormat.baseDateTime ?? (relativeFormat.countUpTime ? 0 : new Date()));

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
    const date = convertToDate(dateTime);

    if (formatChanges) {
        formatChanges.sort((a, b) => toMillis(a.borderUnit, a.borderDateTime) - toMillis(b.borderUnit, b.borderDateTime));

        for (const formatChange of formatChanges) {
            if (date.getTime() < getPastTime(formatChange.borderUnit, formatChange.borderDateTime, formatChange.format.truncateNotReachDigit).getTime()) {
                if (formatChange.format.isAbsolute) {
                    return `${formatDateAsAbsolute(date, formatChange.format)}`;
                } else {
                    return `${formatDateAsRelative(date, formatChange.format)}`;
                }
            }
        }
    }

    return (
        `${defaultFormat.isAbsolute ? formatDateAsAbsolute(date, defaultFormat)
        : formatDateAsRelative(date, defaultFormat)}`
    );
};
