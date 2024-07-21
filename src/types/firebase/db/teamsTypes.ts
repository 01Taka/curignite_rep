import { Timestamp } from "firebase/firestore";
import { DbData } from "./baseTypes";

export interface TeamCode extends DbData {
    teamId: string;
    period: Timestamp | null;
    valid: boolean;
}

// teamsDBの型
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

interface TeamInfoBase extends DbData {
    teamName: string;
    iconPath: string;
    password: string;
    requiredApproval: boolean;
    introduction: string;
    authorUid: string;
    roles: TeamRoles;
}

export interface TeamInfo extends TeamInfoBase {
    createdAt: Timestamp;
}

export interface SerializableTeamInfo extends TeamInfoBase {
    createdAt: number;
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