import { v4 as uuidv4 } from 'uuid';
import { checkIfUserNameTaken } from '../db/auth/users/getUser';

// ランダムな一意の文字列を生成する関数
const generateUniqueString = (): string => {
  return uuidv4();
}

// 重複を避けるためにユーザー名にランダムな文字列を追加する関数
export const getUniqueUserName = async (username: string): Promise<string> => {
  if (await checkIfUserNameTaken(username)) {
    return `${username}${generateUniqueString().slice(0, 8)}`
  }
  return username;
}
