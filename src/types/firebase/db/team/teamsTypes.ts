import { ConvertTimestampToNumber } from "../../../../functions/db/dbUtils";
import { ActionInfo, BaseDocumentData, Member, BasePermissions, RoleType } from "../baseTypes";

export enum TeamPermissionType {
    ManageTeam = 'manageTeam',
    ViewTeam = 'viewTeam',
    EditTeam = 'editTeam',
    DeleteTeam = 'deleteTeam',
    ManageMembers = 'manageMembers',
    InviteMembers = 'inviteMembers',
    ApproveRequests = 'approveRequests',
    RejectRequests = 'rejectRequests'
}

export type TeamPermissions = BasePermissions<TeamPermissionType>;

export interface TeamData extends BaseDocumentData {
    teamName: string;
    iconUrl?: string;
    description?: string;
    hashedPassword: string;
    requiresApproval: boolean;
    members: Member[];
    permissions: TeamPermissions;
    pendingRequests: ActionInfo[];
    invitedUsers: ActionInfo[];
    rejectedUsers: ActionInfo[];
    wholeGroupId: string;
}

export type SerializableTeamData = ConvertTimestampToNumber<TeamData>;

// デフォルトのチーム権限を設定
export const defaultTeamPermissions: TeamPermissions = {
    [RoleType.Admin]: [
        TeamPermissionType.ManageTeam,
        TeamPermissionType.ViewTeam,
        TeamPermissionType.EditTeam,
        TeamPermissionType.DeleteTeam,
        TeamPermissionType.ManageMembers,
        TeamPermissionType.InviteMembers,
        TeamPermissionType.ApproveRequests,
        TeamPermissionType.RejectRequests
    ],
    [RoleType.Member]: [
        TeamPermissionType.ViewTeam,
    ],
    [RoleType.Guest]: [
        TeamPermissionType.ViewTeam
    ]
};

export interface TeamMember extends Member {
    teamId: string;
}