import CryptoJS from 'crypto-js';

// Encryption key
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secret-key';

export class LocalStorageHandler<T extends Record<keyof T, any>> {
    private id: string;
    private keys: (keyof T)[];

    constructor(id: string, keys: (keyof T)[]) {
        this.id = id;
        this.keys = keys;
    }

    private getFullKey(key: keyof T, param?: string): string {
        return param ? `${this.id}-${String(key)}-${param}` : `${this.id}-${String(key)}`;
    }

    private encrypt(data: string, password: string = ""): string {
        return CryptoJS.AES.encrypt(data, `${ENCRYPTION_KEY}${password}`).toString();
    }

    private decrypt(encryptedData: string, password: string = ""): string | null {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, `${ENCRYPTION_KEY}${password}`);
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

    public setData(key: keyof T, data: any, param?: string, password: string = ""): void {
        if (this.isValidKey(key)) {
            const fullKey = this.getFullKey(key, param);
            const jsonData = JSON.stringify(data);  // Convert object to JSON string
            const encryptedData = this.encrypt(jsonData, password);
            localStorage.setItem(fullKey, encryptedData);
        }
    }

    public setDataAllAtOnce(data: Partial<T>, password: string = ""): void {
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                this.setData(key as keyof T, value, undefined, password);
            }
        });
    }

    public getData(key: keyof T, param?: string, password: string = ""): any | null {
        if (this.isValidKey(key)) {
            const fullKey = this.getFullKey(key, param);
            const encryptedData = localStorage.getItem(fullKey);
            if (encryptedData) {
                const decryptedData = this.decrypt(encryptedData, password);
                if (decryptedData) {
                    try {
                        return JSON.parse(decryptedData);  // Convert JSON string back to object
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        }
        return null;
    }

    public getDataAllAtOnce(password: string = ""): Partial<T> {
        return this.keys.reduce((data: Partial<T>, key: keyof T) => {
            const value = this.getData(key, undefined, password);
            if (value !== null) {
                data[key] = value as T[keyof T];
            }
            return data;
        }, {} as Partial<T>);
    }

    public clear(param?: string): void {
        this.keys.forEach(key => {
            const fullKey = this.getFullKey(key, param);
            localStorage.removeItem(fullKey);
        });
    }
}
