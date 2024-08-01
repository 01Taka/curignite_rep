import { DocumentData, Timestamp } from "firebase/firestore";
import { UserData } from "./user/usersTypes";

// 複数のユーザーが参加する機能を持つデータを扱う場合のベースとなる役割
export enum RoleType {
    Admin = 'admin', // システム全体を管理する権限を持つ。
    Member = 'member', // コンテンツを閲覧・投稿できるが、編集や管理権限は持たない。
    Guest = 'guest' // アクセスが制限される
}

// すべての動的Firestoreドキュメントに存在するべきフィールド
export interface BaseDocumentData extends DocumentData {
    docId: string; // ドキュメントId
    createdAt: Timestamp; // 作成日時
    updatedAt: Timestamp; // 更新日時
    isActive: boolean; // 論理的削除の状態
    createdById: string; // 作成者のUserId
}

// ユーザーが参加できる機能を持つデータ用のユーザー定義
export interface Member {
    userId: string;
    username: string;
    iconUrl: string;
    role: RoleType;
}

export interface MemberData {
    userData: UserData;
    role: RoleType;
}

// ユーザーが参加できる機能を持つデータにおいて各ユーザーの権限を保存するフィールドの型
export type BasePermissions<T> =  { [role in RoleType]?: T[] };

// 参加禁止者や招待された人など特別なイベントを受けているユーザーの定義
export interface ActionInfo {
    userId: string;
    actionAt: Timestamp;
}
