import { AuthStates } from "../../../../types/util/stateTypes";
import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { DocumentIdMap } from "../../../../types/firebase/db/formatTypes";
import { BaseDocumentWrite } from "../../../../types/firebase/db/baseTypes";
import { UserRead, UserWrite } from "../../../../types/firebase/db/user/userStructure";
import { StorageManager } from "../../../storage/storageManager";
import { UserWithNotExistUsersId } from "../../../../types/module/redux/slice/userSliceTypes";
import FirestoreService from "../../handler/firestoreService";

export class UserService {
  private fss: FirestoreService<UserRead, UserWrite>;

  constructor(
    firestore: Firestore,
    private storageManager: StorageManager,
  ) {
    this.fss = new FirestoreService(firestore, 'users');
  }

  get firestoreService() {
    return this.fss;
  }

  /**
   * ユーザーを作成し、タスクリストを初期化します。
   */
  async createUser(
    userId: string,
    username: string,
    iconFile: File,
    birthTimestamp: Timestamp
  ): Promise<DocumentReference<DocumentData> | void> {
    try {
      const fileId = await this.storageManager.uploadFile(this.fss.collectionPath, userId, iconFile);

      const data: UserWrite = {
        createdById: userId,
        username,
        avatarIconId: fileId,
        birthTimestamp,
        taskPlan: null,
        state: {
          status: "active",
          lastLearningTimestamp: Timestamp.now(),
          consecutiveLearningNumber: 1,
          maxConsecutiveLearningNumber: 1,
          currentTargetLearningGoalId: null,
          totalLearningTime: 0,
        }
      };
      
      await this.fss.createWithId(userId, data);
    } catch (error) {
      this.handleError("Failed to create user.", error);
    }
  }

  /**
   * ユーザー情報を取得します。
   */
  async getUser(userId: string): Promise<UserRead> {
    const user = await this.fss.read(userId);
    if (!user) throw new Error(`User not found: ${userId}`);
    return user;
  }

  async getUsersWithNotExistIdsAndSupplementary(usersId: string[]): Promise<UserWithNotExistUsersId> {
    // 各IDに対するPromiseを作成
    const dataPromises = usersId.map(async id => {
      const user = await this.fss.read(id);
        const avatarIconUrl = user ? await this.getFileUrl(user.avatarIconId).then((url) => url).catch(() => {
          console.error('failed to get user icon url.');
          return '';
        }) : '';

        const data = user ? {...user, avatarIconUrl } : null;
        return {
          id,
          data,
        }
    });
  
    // 全てのPromiseを解決
    const dataResults = await Promise.all(dataPromises);
  
    // ユーザーデータが存在するかどうかで配列を分ける
    const users: UserRead[] = [];
    const notExistUsersId: string[] = [];
  
    for (const { id, data } of dataResults) {
      if (data) {
        users.push(data);
      } else {
        notExistUsersId.push(id);
      }
    }
  
    // オブジェクトとして結果を返す
    return { users, notExistUsersId };
  }  

  /**
   * UIDがDBに存在するかどうかをチェックします。
   */
  async checkIfUidExists(uid: string): Promise<boolean> {
    try {
      const userSnapshot = await this.fss.readAsDocumentSnapshot(uid);
      return userSnapshot.exists();
    } catch (error) {
      this.handleError("Failed to check UID existence.", error);
    }
  }

  /**
   * ユーザー名がDBに存在するかどうかをチェックします。
   */
  async checkIfUserNameExists(username: string): Promise<boolean> {
    try {
      const user = await this.fss.getFirstMatch('username', username);
      return user !== null;
    } catch (error) {
      this.handleError("Failed to check username existence.", error);
    }
  }

  /**
   * UIDをキーとするデータの辞書を取得します。
   */
  async getUserMapByUids(uids: string[]): Promise<DocumentIdMap<UserRead>> {
    try {
      const userEntries = await Promise.all(
        uids.map(async (uid) => [uid, await this.fss.read(uid)] as [string, UserRead])
      );

      return Object.fromEntries(userEntries);
    } catch (error) {
      this.handleError("Failed to fetch users data by UIDs.", error);
    }
  }

  /**
   * ドキュメントデータからUIDをキーとするデータの辞書を取得します。
   */
  async getCreatorDataByDocuments(data: BaseDocumentWrite[]): Promise<DocumentIdMap<UserRead>> {
    try {
      const uids = data.map(value => value.createdById);
      return await this.getUserMapByUids(uids);
    } catch (error) {
      this.handleError("Failed to fetch users data by Documents.", error);
    }
  }

  /**
   * ユーザーの認証段階を確認します。
   */
  async getUserAuthState(userId: string | null): Promise<AuthStates> {
    if (!userId) return "new";

    try {
      const userData = await this.getUser(userId);
      return userData ? "verified" : getAuth().currentUser ? "noUserData" : "new";
    } catch (error) {
      this.handleError(`Failed to get auth state for userId ${userId}`, error);
    }
  }

  /**
   * 同じチームに所属するメンバーのスペースIDを取得します。
   */
  // async getSameTeamMembersSpaceIdMap(userId: string): Promise<DocumentIdMap<string[]>> {
  //   const userIds = await this.teamMemberService.getSameTeamMembersId(userId);
  //   const users = await this.getUsersByIds(userIds);
  //   return this.createSpaceIdMap(users);
  // }

  // private async getUsersByIds(userIds: string[]): Promise<UserRead[]> {
  //   const data = await Promise.all(userIds.map(id => this.fss.read(id)));
  //   return data.filter(user => user !== null) as UserRead[];
  // }

  // private createSpaceIdMap(users: UserWrite[]): DocumentIdMap<string[]> {
  //   return users.reduce((map, user) => {
  //     if (user.relatedResources?.spaceIds) {
  //       map[user.docId] = user.relatedResources.spaceIds;
  //     }
  //     return map;
  //   }, {} as DocumentIdMap<string[]>);
  // }

  // ヘルパーメソッド群
  private async getFileUrl(fileId: string): Promise<string> {
    return await this.storageManager.getFileUrl(fileId);
  }

  private handleError(message: string, error: unknown): never {
    console.error(message, error);
    throw new Error(message);
  }
}
