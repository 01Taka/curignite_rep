import { UserData } from "../../../../types/firebase/db/user/usersTypes";
import { UsersDB } from "./users";
import { BaseDocumentData, Member } from "../../../../types/firebase/db/baseTypes";
import { AuthStates } from "../../../../types/util/stateTypes";
import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { DocumentIdMap } from "../../../../types/firebase/db/formatTypes";
import { TaskListService } from "../todo/taskListService";

export class UserService {
    constructor(private usersDB: UsersDB, private taskListService: TaskListService) {}

    async createUser(uid: string, username: string, iconUrl: string, birthDate: Timestamp): Promise<DocumentReference<DocumentData> | void> {
        try {
            const taskListRef = await this.taskListService.createTaskListForUser(uid);
            return await this.usersDB.createUser(uid, username, iconUrl, birthDate, { spaceIds: [], taskListId: taskListRef.id });
        } catch (error) {
            throw new Error("Failed to create user.");
        }
    }

    /**
     * UID または UserData を受け取り、常に UserData を返す関数
     * @param uidOrUserData ユーザーのUIDまたはユーザーデータオブジェクト
     * @returns UserData ユーザーデータオブジェクト
     * @throws エラーが発生した場合、エラーメッセージをスローします
     */
    async getUserData(uidOrUserData: string | UserData): Promise<UserData> {
        if (typeof uidOrUserData === "string") {
            const user = await this.usersDB.getUser(uidOrUserData);
            if (!user) {
                throw new Error(`User with ID ${uidOrUserData} not found.`);
            }
            return user;
        }
        return uidOrUserData;
    }

    /**
     * ユーザーの認証段階を確認する
     * @param userId ユーザーID
     * @returns ユーザーの認証段階
     */
    async getUserAuthState(userId: string | null): Promise<AuthStates> {
        try {
            if (!userId) {
                return "new";
            }

            const userData = await this.usersDB.getUser(userId);
            if (userData) {
                return "verified";
            }
    
            const uidExists = !!getAuth().currentUser;
            return uidExists ? "noUserData" : "new";
        } catch (error: any) {
            console.error(`Error in getUserAuthState for userId ${userId}:`, error);
            throw new Error(`Failed to get auth state for userId ${userId}`);
        }
    }    

    /**
     * UID(ドキュメントID)がDBに存在するかどうかをチェックする関数
     * @param uid チェックするUID
     * @returns UIDが存在するかどうかの真偽値
     */
    async checkIfUidExists(uid: string): Promise<boolean> {
        try {
            const user = await this.usersDB.readAsDocumentSnapshot(uid);
            return user.exists();
        } catch (error) {
            console.error("Error checking UID existence: ", error);
            throw new Error("Failed to check UID existence");
        }
    }

    /**
     * ユーザー名がDBに存在するかどうかをチェックする関数
     * @param username チェックするユーザー名
     * @returns ユーザー名が存在するかどうかの真偽値
     */
    async checkIfUserNameExists(username: string): Promise<boolean> {
        try {
            const user = await this.usersDB.getFirstMatch('username', username);
            return user !== null;
        } catch (error) {
            console.error("Error checking username existence: ", error);
            throw new Error("Failed to check username existence");
        }
    }

    /**
     * uidをキーとするデータの辞書を取得
     * @param uids ユーザーのUIDの配列
     * @returns ユーザーのデータを含む辞書オブジェクト
     */
    async getUsersDataByUids(uids: string[]): Promise<DocumentIdMap<UserData>> {
        try {
            const userEntries = await Promise.all(
                uids.map(async (uid) => {
                    const userData = await this.usersDB.getUser(uid);
                    return [uid, userData] as [string, UserData];
                })
            );

            const usersDataByUids = Object.fromEntries(userEntries);
            return usersDataByUids;
        } catch (error) {
            console.error("Error fetching users data by UIDs: ", error);
            throw new Error("Failed to fetch users data by UIDs");
        }
    }

    /**
     * ドキュメントデータからuidをキーとするデータの辞書を取得
     * @param data ドキュメントデータの配列
     * @returns ユーザーのデータを含む辞書オブジェクト
     */
    async getCreatorDataByDocuments (data: BaseDocumentData[]): Promise<DocumentIdMap<UserData>> {
        try {
            const uids = data.map(value => value.createdById);
            return await this.getUsersDataByUids(uids);
        } catch (error) {
            console.error("Error fetching users data by Documents: ", error);
            throw new Error("Failed to fetch users data by Documents");
        }
    } 

    /**
     * 自分が作成したスペースIDのリストに新しくIDを追加
     * @param uidOrUserData ユーザーのUIDまたはユーザーデータオブジェクト
     * @param spaceId 追加するスペースID
     * @throws エラーが発生した場合、エラーメッセージをスローします
     */
    async appendSpaceIdToUserData(uidOrUserData: string | UserData, spaceId: string): Promise<void> {
        try {
            // ユーザーデータを取得
            const user = await this.getUserData(uidOrUserData);

            const uid = user.docId;
            const spaceIds = user.spaceIds || [];

            // 既存のスペースIDリストに新しいIDが含まれていない場合、追加
            if (!spaceIds.includes(spaceId)) {
                await this.usersDB.updateUser(uid, { spaceIds: [...spaceIds, spaceId] });
            }

        } catch (error) {
            console.error('Failed to append spaceId:', error);
            throw new Error('Failed to append spaceId.');
        }
    }

    /**
     * ユーザーが学習中かを確認する関数
     * @param uid ユーザーID
     * @returns ユーザーが学習中であるかのフラグ
     */
    async isLearning(uid: string): Promise<boolean> {
        try {
            const user = await this.usersDB.read(uid);
            return user ? user.spaceIds.length > 0 : false;
        } catch (error) {
            throw new Error("Failed to check if Learning.");
        }
    }

    /**
     * メンバーのユーザーデータを取得する
     * @param members - チームの参加者データ
     * @returns チームの参加者とその役割のユーザーデータ
     */
    async getMembersUserData(members: Member[]): Promise<UserData[]> {
        try {
            const usersData: (UserData | null)[] = await Promise.all(
                members.map(async (member) => {
                    try {
                        const user = await this.usersDB.read(member.userId);
                        return user ? user : null;
                    } catch (error) {
                        console.error(`Error fetching user data for userId: ${member.userId}`, error);
                        return null;
                    }
                })
            );

            // nullの値を除外してユーザーデータを返す
            return usersData.filter(user => user !== null) as UserData[];
        } catch (error) {
            console.error("Error fetching members' user data:", error);
            return [];
        }
    }

    // async getUserAsMember(userId: string, role: RoleType): Promise<Member> {
    //     const user = await this.usersDB.read(userId);
    //     if (!user) {
    //         throw new Error("ユーザーデータが見つかりませんでした。");
    //     }
    //     const member: Member = {
    //         userId,
    //         username: user.username,
    //         iconUrl: user.iconUrl,
    //         role
    //     }
    //     return member;
    // }

    // readUserIdProperties<T extends { userId: string }>(array: T[]): string[] {
    //     const userIds: string[] = [];
    //     array.forEach(data => {
    //         userIds.push(data.userId);
    //     });
    //     return userIds;
    // }
    // >>>    ...sortedMembers.map(member => member.userId),
    // >>>    ...sortedJoinRequests.map(request => request.userId),
}
