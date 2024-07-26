import { Timestamp } from "firebase/firestore";
import { DbData } from "./baseTypes";
import { UserData } from "./usersTypes";

export interface TeamCode extends DbData {
    teamId: string;
    period: Timestamp | null;
    valid: boolean;
}

// teamsDBの型
// uidを保存する
export interface TeamParticipants {
    admin: string[], // 管理者
    regularMember: string[], // 一般メンバー
    invitee: string[], // 招待を送った人
    pending: string[], // 参加の承認待ちの人
    rejected: string[], // 参加が禁止された人
}

export type TeamRoles = keyof TeamParticipants;

export const activeRoles: TeamRoles[] = ["regularMember", "admin"];
export const passiveRoles: TeamRoles[] = ["invitee", "rejected", "pending"];

export const initialTeamParticipantsState: TeamParticipants = {
    admin: [],
    regularMember: [],
    invitee: [],
    pending: [],
    rejected: [],
}

export interface UserWithTeamRole {
    userData: UserData;
    teamId: string;
    role: TeamRoles;
}

export interface UserRoleAssignment {
    uid: string;
    teamId: string;
    role: TeamRoles;
}

interface TeamDataBase extends DbData {
    teamName: string;
    iconPath: string;
    hashedPassword: string;
    requiredApproval: boolean;
    introduction: string;
    authorUid: string;
    participants: TeamParticipants;
}

export interface TeamData extends TeamDataBase {
    createdAt: Timestamp;
}

export interface SerializableTeamData extends TeamDataBase {
    createdAt: number;
}

export const initialTeamDataState: TeamData = {
    documentId: "",
    teamName: "",
    iconPath: "",
    hashedPassword: "",
    requiredApproval: true,
    introduction: "",
    authorUid: "",
    participants: initialTeamParticipantsState,
    createdAt: Timestamp.fromDate(new Date(0)),
}