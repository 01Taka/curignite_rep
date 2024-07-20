import { Timestamp } from "firebase/firestore";
import { DbData } from "../../base";

export interface TeamRoles {
    admin: string[],
    member: string[],
    invitee: string[],
    pending: string[],
    rejected: string[],
}

export type TeamRolesKey = keyof TeamRoles;

export const initialTeamRolesState: TeamRoles = {
    admin: [],
    member: [],
    invitee: [],
    pending: [],
    rejected: [],
}

export interface TeamInfo extends DbData {
    teamName: string;
    iconPath: string;
    password: string;
    requiredApproval: boolean;
    introduction: string;
    authorUid: string;
    roles: TeamRoles;
    createdAt: Timestamp;
}

export const initialTeamInfoState: TeamInfo = {
    documentId: "",
    teamName: "",
    iconPath: "",
    password: "",
    requiredApproval: true,
    introduction: "",
    authorUid: "",
    roles: initialTeamRolesState,
    createdAt: Timestamp.fromDate(new Date(0)),
}