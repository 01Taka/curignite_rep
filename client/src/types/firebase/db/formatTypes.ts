import { FieldValue, Timestamp } from "firebase/firestore";

export type ConvertTimestampToNumber<T> = {
  [K in keyof T]: T[K] extends Timestamp ? number :
                   T[K] extends Array<infer U> ? Array<ConvertTimestampToNumber<U>> :
                   T[K] extends object ? ConvertTimestampToNumber<T[K]> :
                   T[K];
};

// `ConvertTimestampToNumber` から元の型に戻す型
export type RevertTimestampToOriginal<T> = {
  [K in keyof T]: T[K] extends number ? Timestamp :
                  T[K] extends Array<infer U> ? Array<RevertTimestampToOriginal<U>> :
                  T[K] extends object ? RevertTimestampToOriginal<T[K]> :
                  T[K];
};

export type DocumentIdMap<T> = Record<string, T>;

export type TimestampConvertedDocumentMap<T> = DocumentIdMap<ConvertTimestampToNumber<T>>;

export type FieldValueSupported<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends infer U
    ? U extends number
      ? number | FieldValue
      : U extends any[]
      ? U | FieldValue
      : U extends Timestamp
      ? Timestamp | FieldValue
      : U
    : never;
};
