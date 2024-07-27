import { format, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, startOfDay } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

type TimeTypes = number | Timestamp | Date;

/**
 * 入力を Date オブジェクトに変換します。
 * 
 * @param input - number（UNIXエポックタイムスタンプ）、Timestamp、または Date オブジェクト
 * @returns Date オブジェクト
 * @throws Error - 無効な入力タイプの場合
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
 * タイムスタンプをフォーマットされた日付文字列に変換します。
 * 
 * @param timestamp - ミリ秒単位のUNIXエポックタイムスタンプまたはFirebase Timestampオブジェクト
 * @param defaultFormat - 基準日付から一定以内のフォーマット（デフォルトは 'yyyy-MM-dd HH:mm:ss'）
 * @param alternateFormat - 基準日付から一定以上のフォーマット（デフォルトは 'yyyy-MM-dd'）
 * @param threshold - フォーマットを切り替えるための期間（日単位）
 * @param baseDate - 基準日付（Dateオブジェクト）
 * @returns フォーマットされた日付文字列
 */
export const timestampToString = (
    timestamp: TimeTypes,
    defaultFormat: string = 'yyyy-MM-dd HH:mm:ss',
    alternateFormat: string = 'yyyy-MM-dd',
    threshold: number = 1, // デフォルトは1日
    baseDate: Date = new Date()
): string => {
    const date = toDate(timestamp);
    const baseDateStart = startOfDay(baseDate);
    const dateStart = startOfDay(date);
    const diffDays = differenceInDays(baseDateStart, dateStart);

    const formatStr = diffDays <= threshold ? defaultFormat : alternateFormat;
    return format(date, formatStr);
};

/**
 * 日付を相対的な文字列に変換します。
 * 
 * @param timestamp - 対象の日付（UNIXエポックタイムスタンプまたはFirebase Timestampオブジェクト）
 * @param unit - フォーマット後の語尾につける文字列
 * @param baseDate - 基準日付（デフォルトは今日の日付）
 * @param formats - フォーマット設定オブジェクト（デフォルトは `{ seconds: '秒前', minutes: '分前', hours: '時間前', days: '日前' }`）
 * @returns 相対的な日付文字列
 */
export const relativeDateString = (
    timestamp: TimeTypes,
    unit: string = "",
    baseDate: TimeTypes = new Date(),
    formats: Partial<{
        seconds: string,
        minutes: string,
        hours: string,
        days: string
    }> = {},
): string => {
    const date = toDate(timestamp);
    const base = toDate(baseDate);
    
    const diffSeconds = differenceInSeconds(base, date);
    const diffMinutes = differenceInMinutes(base, date);
    const diffHours = differenceInHours(base, date);
    const diffDays = differenceInDays(base, date);

    const defaultFormats = {
        seconds: '秒',
        minutes: '分',
        hours: '時間',
        days: '日',
        ...formats
    };

    if (diffSeconds < 60) {
        return `${diffSeconds}${defaultFormats.seconds}${unit}`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes}${defaultFormats.minutes}${unit}`;
    } else if (diffHours < 24) {
        const hours = Math.floor(diffHours);
        const minutes = Math.floor(diffMinutes % 60);
        return `${hours}${defaultFormats.hours}${minutes}${defaultFormats.minutes}${unit}`;
    } else {
        return `${diffDays}${defaultFormats.days}${unit}`;
    }
};