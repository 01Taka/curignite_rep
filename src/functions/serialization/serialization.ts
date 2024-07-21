import { Timestamp } from "firebase/firestore";

type FirestoreData = any;

// TimeStamp型をミリ秒に変換
// シリアライズ関数
export const serializeFirestoreData = (data: FirestoreData): FirestoreData => {
    if (data instanceof Timestamp) {
        return data.toMillis();
    }

    if (Array.isArray(data)) {
        return data.map(serializeFirestoreData);
    }

    if (data !== null && typeof data === 'object') {
        return Object.keys(data).reduce((acc: { [key: string]: FirestoreData }, key: string) => {
            acc[key] = serializeFirestoreData(data[key]);
            return acc;
        }, {});
    }

    return data;
};

// デシリアライズ関数
export const deserializeFirestoreData = (data: FirestoreData): FirestoreData => {
    if (typeof data === 'number') {
        return Timestamp.fromMillis(data);
    }

    if (Array.isArray(data)) {
        return data.map(deserializeFirestoreData);
    }

    if (data !== null && typeof data === 'object') {
        return Object.keys(data).reduce((acc: { [key: string]: FirestoreData }, key: string) => {
            acc[key] = deserializeFirestoreData(data[key]);
            return acc;
        }, {});
    }

    return data;
};
