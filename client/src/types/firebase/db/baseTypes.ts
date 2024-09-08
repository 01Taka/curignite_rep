import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";

// すべての動的Firestoreドキュメントに存在するべきフィールド
export interface BaseDocumentData extends DocumentData {
    docId: string; // ドキュメントId
    createdAt: Timestamp; // 作成日時
    updatedAt: Timestamp; // 更新日時
    deletedAt?: Timestamp // 削除日時
    isActive: boolean; // 論理的削除の状態
    createdById: string; // 作成者のUserId
}

/**
 * チームやグループ内でのメンバーの役割を定義するenumです。
 */
export enum BaseMemberRole {
    /**
     * 管理者 (Admin)
     * - 全ての権限を持ち、システムやグループの設定変更が可能です。
     * - メンバーの管理や全体の操作が行えます。
     * - グループ内の全てのコンテンツにアクセスし、管理することができます。
     */
    Admin = 'admin',

    /**
     * モデレーター (Moderator)
     * - 特定の管理権限を持ち、メンバーの監視や秩序の維持を行います。
     * - コンテンツの管理やメンバーへの対応が可能です。
     */
    Moderator = 'moderator',

    /**
     * メンバー (Member)
     * - グループやチャットルームに参加し、通常の操作が可能です。
     * - 自分の情報やコンテンツの管理が行えます。
     */
    Member = 'member',

    /**
     * ゲスト (Guest)
     * - 制限されたアクセス権を持ち、主に閲覧のみが可能です。
     * - 制限された操作範囲での参加や情報の表示ができます。
     */
    Guest = 'guest'
}

export enum BaseParticipationStatus {
    Active = "active",
    Pending = "pending",
    Eligible = "eligible",
    Declined = "declined",
    None = "none"
}

// ユーザーが参加できる機能を持つデータにおいて各ユーザーの権限を保存するフィールドの型
export type BasePermissions<T> =  { [role in BaseMemberRole]?: T[] };