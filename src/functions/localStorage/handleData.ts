import CryptoJS from 'crypto-js';

// 暗号化に使用するキー
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secret-key'; // 環境変数を使用

class LocalStorageHandler<T extends Record<keyof T, string>> {
    private id: string;
    private keys: (keyof T)[];

    constructor(id: string, keys: (keyof T)[]) {
        this.id = id;
        this.keys = keys;
    }

    private getFullKey(key: keyof T): string {
        return `${this.id}-${String(key)}`;
    }

    private encrypt(data: string): string {
        return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    }

    private decrypt(encryptedData: string): string | null {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            console.error('Error decrypting data:', e);
            return null;
        }
    }

    private isValidKey(key: keyof T): boolean {
        if (!this.keys.includes(key)) {
            console.error(`Invalid key: ${String(key)}.`);
            return false;
        }
        return true;
    }

    public setData(key: keyof T, data: string): void {
        if (this.isValidKey(key)) {
            const fullKey = this.getFullKey(key);
            const encryptedData = this.encrypt(data);
            localStorage.setItem(fullKey, encryptedData);
        }
    }

    public setDataAllAtOnce(data: Partial<T>): void {
        Object.entries(data).forEach(([key, value]) => {
            if (!!value) {
                this.setData(key as keyof T, value.toString());
            }
        });
    }

    public getData(key: keyof T): string | null {
        if (this.isValidKey(key)) {
            const fullKey = this.getFullKey(key);
            const encryptedData = localStorage.getItem(fullKey);
            if (encryptedData) {
                return this.decrypt(encryptedData);
            }
            console.error(`No data found for key: ${String(key)}.`);
        }
        return null;
    }

    public getDataAllAtOnce(): Partial<T> {
        return this.keys.reduce((data: Partial<T>, key: keyof T) => {
            const value = this.getData(key);
            if (value !== null) {
                data[key] = value as T[keyof T];
            }
            return data;
        }, {} as Partial<T>);
    }

    public clear(): void {
        this.keys.forEach(key => {
            const fullKey = this.getFullKey(key);
            localStorage.removeItem(fullKey);
        });
    }
}


export interface AuthStorageProps {
    username: string;
    email: string;
    password: string;
}

const authStorage = new LocalStorageHandler<AuthStorageProps>('authData', ['username', 'email', 'password']);

export { authStorage }