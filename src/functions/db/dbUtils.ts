import { Timestamp } from "firebase/firestore";
import { BaseDocumentData, Member, RoleType } from "../../types/firebase/db/baseTypes";

export type ConvertTimestampToNumber<T> = {
    [K in keyof T]: T[K] extends Timestamp ? number : T[K];
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

export const createAdminMember = (userId: string): Member => {
    return { userId, role: RoleType.Admin };
}