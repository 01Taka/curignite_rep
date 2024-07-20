import { Timestamp } from "firebase/firestore";
import { DbData } from "../../base";
import { TeamRolesKey } from "../team/teamsTypes";

// UserDB関連のインターフェース
export interface User extends DbData {
    username: string;
    birthDate: Timestamp;
    createdAt: Timestamp;
}

export interface UserOrganizationInfo extends DbData {
    uid: string;
    organizationId: string;
    organizationName: string;
    grade: number;
    classNumber: number;
    joinedAt: Timestamp;
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