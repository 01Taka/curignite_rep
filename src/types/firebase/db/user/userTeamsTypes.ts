import { BaseDocumentData, RoleType } from "../baseTypes";

// TeamStatus 列挙型を定義
export enum UserTeamStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected",
}

export interface UserTeamData extends BaseDocumentData {
    teamId: string;
    teamName: string;
    teamIconUrl: string;
    role?: RoleType;
    myTeam: boolean;
    status: UserTeamStatus;
}