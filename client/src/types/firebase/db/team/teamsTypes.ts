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
    requiresApproval: boolean;
    members: Member[];
    learningMembers: ActionInfo<"learning">[];
    permissions: TeamPermissions;
    pendingRequests: ActionInfo<"pending">[];
    invitedUsers: ActionInfo<"invited">[];
    rejectedUsers: ActionInfo<"rejected">[];
    wholeGroupId: string;
}

export type TeamActionTypes = "pending" | "invited" | "rejected";

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