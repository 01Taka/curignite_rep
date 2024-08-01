import { usersDB } from "../../dbs";
import { UserData, UserDictionary } from "../../../../types/firebase/db/user/usersTypes";
import { getCurrentUser } from "../../../auth/auth";
import { UsersDB } from "./users";
import { Member } from "../../../../types/firebase/db/baseTypes";

export class UserService {
    constructor(private usersDB: UsersDB) {}

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
     * 現在のユーザーのデータを取得
     * @returns 現在のユーザーデータ、またはnull
     */
    async getCurrentUserData(): Promise<UserData | null> {
        try {
            const user = await getCurrentUser();
            if (user) {
                return await this.usersDB.getUser(user.uid);
            }
            return null;
        } catch (error) {
            console.error('Failed to get current user data: ', error);
            return null;
        }
    }

    /**
     * uidをキーとするデータの辞書を取得
     * @param uids ユーザーのUIDの配列
     * @returns ユーザーのデータを含む辞書オブジェクト
     */
    async getUsersDataByUids(uids: string[]): Promise<UserDictionary> {
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
}
