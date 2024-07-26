import { Timestamp } from "firebase/firestore";
import { DbData } from "./baseTypes";
import { SelectItem } from "../../componentsTypes";

// 配列の定義
export const publicationTarget = ["team", "friend", "private"] as const;

// リテラル型のユニオン型を取得
export type PublicationTarget = typeof publicationTarget[number];

// PublicationTarget 用の SelectItem 定義
export const publicationTargetForSelect: SelectItem<PublicationTarget>[] = [
  { label: "チーム", value: "team" },
  { label: "フレンド", value: "friend" },
  { label: "非公開", value: "private" },
];


interface SpaceBaseData extends DbData{
    spaceName: string;
    introduction: string;
    authorUid: string;
    publicationTarget: PublicationTarget;
    requiredApproval: boolean;
    memberUids: string[];
}

export interface SpaceData extends SpaceBaseData {
    createdAt: Timestamp;
}

export interface SerializableSpaceData extends SpaceBaseData {
    createdAtMillis: number;
}
