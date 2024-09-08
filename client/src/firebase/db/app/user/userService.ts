import { AuthStates } from "../../../../types/util/stateTypes";
import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { DocumentIdMap } from "../../../../types/firebase/db/formatTypes";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import BaseDB from "../../base";
import { BaseDocumentData } from "../../../../types/firebase/db/baseTypes";
import { TeamMemberService } from "../team/subCollection/teamMemberService";
import { UserData, UserWithSupplementary } from "../../../../types/firebase/db/user/userStructure";
import { StorageManager } from "../../../storage/storageManager";
import { UserLearningSessionService } from "./subCollection/userLearningSessionService";
import { UserWithNotExistUsersId } from "../../../../types/module/redux/slice/userSliceTypes";

export class UserService {
  private baseDB: BaseDB<UserData>;

  constructor(
    firestore: Firestore,
    private storageManager: StorageManager,
    private learningService: UserLearningSessionService,
    private teamMemberService: TeamMemberService,
  ) {
    this.baseDB = new BaseDB(firestore, "users");
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
      const fileId = await this.storageManager.uploadFile(this.baseDB.getCollectionPath(), userId, iconFile);

      const data: UserData = {
        ...getInitialBaseDocumentData(userId),
        username,
        avatarIconId: fileId,
        birthTimestamp,
        isLearning: false,
        lastLearningTimestamp: Timestamp.now(),
        consecutiveLearningNumber: 0,
        currentTargetGoalId: null,
        totalLearningTime: 0,
      };
      
      await this.baseDB.createWithId(userId, data);
      await this.learningService.createOrUpdateDailySession(userId);
    } catch (error) {
      this.handleError("Failed to create user.", error);
    }
  }

  /**
   * ユーザー情報を取得します。
   */
  async getUser(userId: string): Promise<UserData> {
    const user = await this.baseDB.read(userId);
    if (!user) throw new Error(`User not found: ${userId}`);
    return user;
  }

  async getUsersWithNotExistIdsAndSupplementary(usersId: string[]): Promise<UserWithNotExistUsersId> {
    // 各IDに対するPromiseを作成
    const dataPromises = usersId.map(async id => {
      const user = await this.baseDB.read(id)
      const data = user ? {...user, avatarIconUrl: await this.getFileUrl(user.avatarIconId)} : null;

      return {
        id,
        data,
      }
    });
  
    // 全てのPromiseを解決
    const dataResults = await Promise.all(dataPromises);
  
    // ユーザーデータが存在するかどうかで配列を分ける
    const users: UserWithSupplementary[] = [];
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
      const userSnapshot = await this.baseDB.readAsDocumentSnapshot(uid);
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
      const user = await this.baseDB.getFirstMatch('username', username);
      return user !== null;
    } catch (error) {
      this.handleError("Failed to check username existence.", error);
    }
  }

  /**
   * UIDをキーとするデータの辞書を取得します。
   */
  async getUserMapByUids(uids: string[]): Promise<DocumentIdMap<UserData>> {
    try {
      const userEntries = await Promise.all(
        uids.map(async (uid) => [uid, await this.baseDB.read(uid)] as [string, UserData])
      );

      return Object.fromEntries(userEntries);
    } catch (error) {
      this.handleError("Failed to fetch users data by UIDs.", error);
    }
  }

  /**
   * ドキュメントデータからUIDをキーとするデータの辞書を取得します。
   */
  async getCreatorDataByDocuments(data: BaseDocumentData[]): Promise<DocumentIdMap<UserData>> {
    try {
      const uids = data.map(value => value.createdById);
      return await this.getUserMapByUids(uids);
    } catch (error) {
      this.handleError("Failed to fetch users data by Documents.", error);
    }
  }

  /**
   * 自分が作成したスペースIDのリストに新しくIDを追加します。
   */
  async appendSpaceId(userId: string, spaceId: string): Promise<void> {
    await this.updateSpaceIdList(userId, spaceIds => {
      if (!spaceIds.includes(spaceId)) {
        return [...spaceIds, spaceId];
      }
      return spaceIds;
    });
  }

  /**
   * 自分が作成したスペースIDのリストからIDを削除します。
   */
  async removeSpaceId(userId: string, spaceId: string): Promise<void> {
    await this.updateSpaceIdList(userId, spaceIds => spaceIds.filter(id => id !== spaceId));
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
  async getSameTeamMembersSpaceIdMap(userId: string): Promise<DocumentIdMap<string[]>> {
    const userIds = await this.teamMemberService.getSameTeamMembersId(userId);
    const users = await this.getUsersByIds(userIds);
    return this.createSpaceIdMap(users);
  }

  /**
   * ユーザーのタスクリストIDを取得します。
   */
  async getTaskListId(userId: string): Promise<string> {
    try {
      const user = await this.getUser(userId);
      return user.relatedResources.taskListId;
    } catch (error) {
      this.handleError(`Failed to retrieve task list ID for userId ${userId}.`, error);
    }
  }

  async setCurrentTargetGoalId(userId: string, goalId: string): Promise<void> {
    try {
      await this.baseDB.update(userId, { currentTargetGoalId: goalId});
    } catch (error) {
      this.handleError(`Failed to update currentTargetGoalId ${userId}`, error);
    }
  }

  async setIsLearning(userId: string, status: boolean): Promise<void> {
    await this.baseDB.update(userId, { isLearning: status });
  }

  // ヘルパーメソッド群
  private async getFileUrl(fileId: string): Promise<string> {
    return await this.storageManager.getFileUrl(fileId);
  }

  private async getUsersByIds(userIds: string[]): Promise<UserData[]> {
    const data = await Promise.all(userIds.map(id => this.baseDB.read(id)));
    return data.filter(user => user !== null) as UserData[];
  }

  private createSpaceIdMap(users: UserData[]): DocumentIdMap<string[]> {
    return users.reduce((map, user) => {
      if (user.relatedResources?.spaceIds) {
        map[user.docId] = user.relatedResources.spaceIds;
      }
      return map;
    }, {} as DocumentIdMap<string[]>);
  }

  private async updateSpaceIdList(userId: string, updateFn: (spaceIds: string[]) => string[]): Promise<void> {
    try {
      const user = await this.getUser(userId);
      const updatedSpaceIds = updateFn(user.relatedResources.spaceIds || []);
      await this.baseDB.update(userId, { "relatedResources.spaceIds": updatedSpaceIds });
    } catch (error) {
      this.handleError(`Failed to update space IDs for user ${userId}.`, error);
    }
  }

  private handleError(message: string, error: unknown): never {
    console.error(message, error);
    throw new Error(message);
  }
}
