import { Timestamp } from "firebase/firestore";
import { DbData } from "./baseTypes";
import { TeamRolesKey } from "./teamsTypes";

// UserDB関連のインターフェース
interface UserBase extends DbData {
    username: string;
}

export interface User extends UserBase {
    birthDate: Timestamp;
    createdAt: Timestamp;
}

export interface SerializableUser extends UserBase {
    birthDate: number;
    createdAt: number;
}

interface UserOrganizationInfoBase extends DbData {
    uid: string;
    organizationId: string;
    organizationName: string;
    grade: number;
    classNumber: number;
}

export interface UserOrganizationInfo extends UserOrganizationInfoBase {
    joinedAt: Timestamp;
}

export interface SerializableUserOrganizationInfo {
    joinedAt: number;
}

export interface UserTeamInfo extends DbData {
    teamId: string;
    teamName: string;
    teamIconPath: string;
    roles: TeamRolesKey;
    myTeam: boolean;
}


// UserDB関連の初期値
export const userInitialUserState: User = {
    documentId: '',
    username: '',
    birthDate: Timestamp.fromDate(new Date(0)),
    createdAt: Timestamp.fromDate(new Date(0)),
};

export const initialUserOrganizationInfoState: UserOrganizationInfo = {
    documentId: "",
    uid: "",
    organizationId: '',
    organizationName: '',
    grade: 0,
    classNumber: 0,
    joinedAt: Timestamp.fromDate(new Date(0)),
};

export const initialUserTeamInfoState: UserTeamInfo = {
    documentId: "",
    teamId: "",
    teamName: "",
    teamIconPath: "",
    roles: "pending",
    myTeam: false,
}