import { v4 as uuidv4 } from 'uuid';
import { checkIfUserNameTaken } from '../db/users/getUser';

// ランダムな一意の文字列を生成する関数
const generateUniqueString = (): string => {
  return uuidv4();
}

// 重複を避けるためにユーザー名にランダムな文字列を追加する関数
export const getUniqueUserName = async (username: string): Promise<string> => {
  let uniqueUserName: string = username;
  
  while (await checkIfUserNameTaken(uniqueUserName)) {
    uniqueUserName = `${username}${generateUniqueString().slice(0, 8)}`; // 8文字のランダムな文字列を追加
  }
  
  return uniqueUserName;
}
