import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { UserData, UserMetaData } from "../../../../types/firebase/db/user/usersTypes";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";

/**
 * ユーザーデータを扱うためのデータベースクラス
 */
export class UsersDB extends BaseDB<UserData> {
  /**
   * コンストラクタ
   * @param firestore Firestoreのインスタンス
   */
  constructor(firestore: Firestore) {
    super(firestore, 'users'); // 'users' コレクションを使用
  }

  /**
   * ユーザーを作成する
   * @param uid ユーザーID
   * @param username ユーザー名
   * @param iconUrl ユーザーアイコンのURL
   * @param spaceIds ユーザーが参加しているスペースのIDの配列
   * @param birthDate ユーザーの生年月日
   * @returns 作成されたユーザーのDocumentReferenceまたはvoid
   */
  async createUser(
    uid: string,
    username: string,
    iconUrl: string,
    birthDate: Timestamp,
    metaData: UserMetaData
  ): Promise<DocumentReference<DocumentData> | void> {
    try {
      const data: UserData = {
        ...getInitialBaseDocumentData(uid, uid),
        username,
        iconUrl,
        birthDate,
        metaData,
      };
      return this.createWithId(uid, data); // UIDを使ってドキュメントを作成
    } catch (error) {
      console.error("Error creating user: ", error);
      throw new Error("Failed to create user"); // エラー発生時にカスタムエラーメッセージをスロー
    }
  }

  /**
   * ユーザーを読み取る
   * @param uid ユーザーID
   * @returns ユーザーデータまたはnull
   */
  async getUser(uid: string): Promise<UserData | null> {
    return this.read(uid); // ドキュメントIDで読み取る
  }

  /**
   * ユーザーを更新する
   * @param uid ユーザーID
   * @param updates 更新するデータ
   */
  async updateUser(uid: string, updates: Partial<UserData>): Promise<void> {
    return this.update(uid, updates); // ドキュメントIDで更新する
  }

  /**
   * ユーザーを削除する
   * @param uid ユーザーID
   */
  async deleteUser(uid: string): Promise<void> {
    return this.softDelete(uid); // ドキュメントIDで削除する
  }
}
