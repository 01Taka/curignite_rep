import { Timestamp } from "firebase/firestore";
import { ActionInfo, BaseDocumentData, Member, MemberData, RoleType } from "../../types/firebase/db/baseTypes";
import serviceFactory from "../../firebase/db/factory";

export type ConvertTimestampToNumber<T> = {
    [K in keyof T]: T[K] extends Timestamp ? number :
                     T[K] extends Array<infer U> ? Array<ConvertTimestampToNumber<U>> :
                     T[K] extends object ? ConvertTimestampToNumber<T[K]> :
                     T[K];
};

// `ConvertTimestampToNumber` から元の型に戻す型
export type RevertTimestampToOriginal<T> = {
    [K in keyof T]: T[K] extends number ? Timestamp :
                    T[K] extends Array<infer U> ? Array<RevertTimestampToOriginal<U>> :
                    T[K] extends object ? RevertTimestampToOriginal<T[K]> :
                    T[K];
};

// データを変換する関数
// `Timestamp` を `number` (UNIXタイムスタンプ) に変換する関数
const timestampToNumber = (timestamp: Timestamp): number => {
    return timestamp.seconds; // 秒単位のUNIXタイムスタンプを返します
};

// データを再帰的に変換する関数
export const convertTimestampsToNumbers = <T>(data: T): ConvertTimestampToNumber<T> => {
    if (data instanceof Timestamp) {
        return timestampToNumber(data) as any;
    }

    if (Array.isArray(data)) {
        return data.map(item => convertTimestampsToNumbers(item)) as any;
    }

    if (typeof data === 'object' && data !== null) {
        const result: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                result[key] = convertTimestampsToNumbers((data as any)[key]);
            }
        }
        return result;
    }

    return data as any;
};

// Timestampに戻すための関数
export const revertTimestampConversion = <T>(data: ConvertTimestampToNumber<T>): T => {
    if (typeof data === 'number') {
        return new Timestamp(data, 0) as any;
    }

    if (Array.isArray(data)) {
        return data.map(item => revertTimestampConversion(item)) as any;
    }

    if (typeof data === 'object' && data !== null) {
        const result: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                result[key] = revertTimestampConversion((data as any)[key]);
            }
        }
        return result;
    }

    return data as any;
};

// 動的ドキュメント作成時の初期値を取得する
export const getInitialBaseDocumentData = (createdById: string, docId: string = ""): BaseDocumentData => {
    return {
        docId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isActive: true,
        createdById,
    }
}

/**
 * 管理者メンバーとして作成者を追加するための関数
 * @param userId ユーザーのID
 * @returns 空の配列またはユーザーIDに対応するユーザーのメンバーデータ一つ
 */
export const createInitialAdminMember = async (userId: string): Promise<Member[]> => {
    try {
        // データベースからユーザーデータを取得
        const userData = await serviceFactory.getUsersDB().read(userId);
        
        // ユーザーデータが存在する場合、Member オブジェクトを作成
        if (userData) {
            return [{ 
                userId, 
                username: userData.username, 
                iconUrl: userData.iconUrl, 
                role: RoleType.Admin 
            }];
        } else {
            console.error(`User data not found for userId: ${userId}`);
            return [];
        }
    } catch (error) {
        // エラーが発生した場合、エラーメッセージを表示し、空の配列を返す
        console.error(`Failed to create admin member for userId: ${userId}`, error);
        return [];
    }
}

export const getMembersData = async (members: Member[]): Promise<MemberData[]> => {
    const usersDB = serviceFactory.getUsersDB();
    
    try {
        const membersData = await Promise.all(members.map(async (member) => {
            try {
                const userData = await usersDB.read(member.userId);
                if (userData) {
                    return {
                        userData,
                        role: member.role,
                    } as MemberData;
                }
            } catch (error) {
                console.error(`Failed to fetch data for user ${member.userId}:`, error);
            }
            return null; // エラーが発生した場合やユーザーが見つからない場合は null を返す
        }));

        return membersData.filter((data): data is MemberData => data !== null); // null をフィルタリング
    } catch (error) {
        console.error("Failed to get members data:", error);
        return []; // エラー発生時には空の配列を返す
    }
}

/**
 * 指定したユーザーIDがアクション情報リストに含まれているかどうかをチェックします。
 * @param userId ユーザーID
 * @param actionInfo アクション情報リスト
 * @returns ユーザーがアクション情報リストに含まれているかどうか
 */
export const isUserInActionInfo = (userId: string, actionInfo: ActionInfo[]): boolean => {
    return actionInfo && actionInfo.some(info => info.userId === userId);
}

/**
 * 指定したユーザーIDがメンバーリストに含まれているかどうかをチェックします。
 * @param userId ユーザーID
 * @param members メンバーリスト
 * @returns ユーザーがメンバーリストに含まれているかどうか
 */
export const isUserInMembers = (userId: string, members: Member[]): boolean => {
    return members && members.some(member => member.userId === userId);
}
