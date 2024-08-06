import CryptoJS from 'crypto-js';

// SHA-256でデータをハッシュ化する関数
export const hashDataSHA256 = (data: string): string => {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

// 生データとハッシュ化されたデータが一致するかを判断する関数
export const isDataMatch = (data: string, hashedData: string): boolean => {
    const hashedInputData = hashDataSHA256(data);
    return hashedInputData === hashedData;
}