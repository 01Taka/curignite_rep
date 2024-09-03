import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../../types/firebase/db/baseTypes";
import { ConvertTimestampToNumber, DocumentIdMap, TimestampConvertedDocumentMap } from "../../types/firebase/db/formatTypes";

/**
 * Timestampをnumberに変換する関数
 * @param timestamp - FirestoreのTimestamp
 * @returns number型のUNIXタイムスタンプ
 */
const timestampToNumber = (timestamp: Timestamp): number => timestamp.seconds;

/**
 * データを再帰的に変換する関数
 * Timestampをnumberに変換します
 * @param data - 変換対象のデータ
 * @returns 変換後のデータ
 */
export const convertTimestampsToNumbers = <T>(data: T): ConvertTimestampToNumber<T> => {
  if (data instanceof Timestamp) {
    return timestampToNumber(data) as ConvertTimestampToNumber<T>;
  }

  if (Array.isArray(data)) {
    return data.map(item => convertTimestampsToNumbers(item)) as ConvertTimestampToNumber<T>;
  }

  if (typeof data === 'object' && data !== null) {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = convertTimestampsToNumbers((data as any)[key]);
      }
    }
    return result as ConvertTimestampToNumber<T>;
  }

  return data as ConvertTimestampToNumber<T>;
};

/**
 * numberをTimestampに戻す関数
 * @param data - 変換対象のデータ
 * @returns 変換後のデータ
 */
export const revertTimestampConversion = <T>(data: ConvertTimestampToNumber<T>): T => {
  if (typeof data === 'number') {
    return new Timestamp(data, 0) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map(item => revertTimestampConversion(item)) as unknown as T;
  }

  if (typeof data === 'object' && data !== null) {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = revertTimestampConversion((data as any)[key]);
      }
    }
    return result as T;
  }

  return data as T;
};

/**
 * 配列を変換して辞書にする関数
 * @param array - 配列データ
 * @returns Timestampがnumberに変換されたドキュメントIDをキーとする辞書
 */
export const arrayToDictWithTimestampToNumbers = <T extends BaseDocumentData>(array: T[]): TimestampConvertedDocumentMap<T> => {
  return array.reduce((acc, item) => {
    acc[item.docId] = convertTimestampsToNumbers(item);
    return acc;
  }, {} as TimestampConvertedDocumentMap<T>);
};

/**
 * Timestampに戻した辞書を配列に変換します。
 * @param dict - Timestampがnumberに変換されたドキュメントIDをキーとする辞書
 * @returns 元のデータ型に戻されたドキュメントの配列
 */
export const dictToArrayWithRevertTimestampConversion = <T extends BaseDocumentData>(dict: TimestampConvertedDocumentMap<T>): T[] => {
  const convertedDict = Object.entries(dict).reduce((acc, [key, value]) => {
    acc[key] = revertTimestampConversion(value) as unknown as T;
    return acc;
  }, {} as DocumentIdMap<T>);

  return Object.values(convertedDict);
};
