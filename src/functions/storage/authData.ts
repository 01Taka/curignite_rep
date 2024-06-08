import { clearData, getData, saveData} from "./handleData";


// 複数のデータをセット
export const setAuthData = (username: string, email: string, password: string): void => {
    setUserNameData(username);
    setEmailData(email);
    setPasswordData(password);
}

// AuthDataインターフェース
interface AuthData {
    username: string;
    email: string;
    password: string;
}

// 複数のデータを取得
export const getAuthData = (): AuthData => {
    const username = getUserNameData() || "";
    const email = getEmailData() || "";
    const password = getPasswordData() || "";
    return { username, email, password };
}

export const clearAuthData = () => {
    clearUserNameData();
    clearEmailData();
    clearPasswordData();
}

// ユーザー名データのセット
export const setUserNameData = (username: string): void => {
    saveData('username', username);
}

// ユーザー名データの取得
export const getUserNameData = (): string => {
    return getData('username') || "";
}

// ユーザー名データのクリア
export const clearUserNameData = (): void => {
    clearData('username');
}

// Emailデータのセット
export const setEmailData = (email: string): void => {
    saveData('email', email);
}

// Emailデータの取得
export const getEmailData = (): string => {
    return getData('email') || "";
}

// Emailデータのクリア
export const clearEmailData = (): void => {
    clearData('email');
}

// パスワードデータのセット
export const setPasswordData = (password: string): void => {
    saveData('password', password);
}

// パスワードデータの取得
export const getPasswordData = (): string => {
    return getData('password') || "";
}

// パスワードデータのクリア
export const clearPasswordData = (): void => {
    clearData('password');
}
