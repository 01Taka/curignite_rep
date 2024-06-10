import CryptoJS from 'crypto-js';

// 暗号化に使用するキー
const encryptionKey = 'your-secret-key'; // これは安全な場所に保存し、環境変数などから取得するのがベストです

// データを暗号化してローカルストレージに保存
export const saveData = (key: string, data: string): void => {
    const encryptedData = CryptoJS.AES.encrypt(data, encryptionKey).toString();
    localStorage.setItem(key, encryptedData);
}

// 暗号化されたデータを復号化して取得
export const getData = (key: string): string | null => {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedData;
        } catch (e) {
            console.error('Error decrypting data', e);
            return null;
        }
    }
    return null;
}

// データをクリア
export const clearData = (key: string): void => {
    localStorage.removeItem(key);
}
