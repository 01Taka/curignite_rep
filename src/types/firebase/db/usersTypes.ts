import { Timestamp } from "firebase/firestore";
import { DbData } from "./baseTypes";
import { TeamRoles } from "./teamsTypes";

// UserDB関連のインターフェース
interface UserBaseData extends DbData {
    username: string;
    spaceIds: string[];
}

export interface UserData extends UserBaseData {
    birthDate: Timestamp;
    createdAt: Timestamp;
}

export interface SerializableUserData extends UserBaseData {
    birthDate: number;
    createdAt: number;
}

interface OrganizationBaseData extends DbData {
    uid: string;
    organizationId: string;
    organizationName: string;
    grade: number;
    classNumber: number;
}

export interface UserOrganizationData extends OrganizationBaseData {
    joinedAt: Timestamp;
}

export interface SerializableUserOrganizationData extends OrganizationBaseData {
    joinedAt: number;
}

export interface UserTeamData extends DbData {
    teamId: string;
    teamName: string;
    teamIconPath: string;
    role: TeamRoles;
    myTeam: boolean;
}


// UserDB関連の初期値
export const userInitialUserState: UserData = {
    documentId: '',
    username: '',
    spaceIds: [],
    birthDate: Timestamp.fromDate(new Date(0)),
    createdAt: Timestamp.fromDate(new Date(0)),
};

export const initialUserOrganizationDataState: UserOrganizationData = {
    documentId: "",
    uid: "",
    organizationId: '',
    organizationName: '',
    grade: 0,
    classNumber: 0,
    joinedAt: Timestamp.fromDate(new Date(0)),
};

export const initialUserTeamDataState: UserTeamData = {
    documentId: "",
    teamId: "",
    teamName: "",
    teamIconPath: "",
    role: "pending",
    myTeam: false,
}

export type UserDictionary = { [key: string]: UserData };