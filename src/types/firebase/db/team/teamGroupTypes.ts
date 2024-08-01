import { ActionInfo, BaseDocumentData, BasePermissions, Member, RoleType } from "../baseTypes";

// グループの公開設定
export type TeamGroupVisibility = 'public' | 'private';
// グループの現在のステータス
export type TeamGroupStatus = 'active' | 'inactive' | 'archived';

export interface TeamGroupTag {
    tagName: string,
    tagColorCode: `#${string}`,
    tagDescription: string,
}

export enum TeamGroupPermissionType {
    ManageTeamGroup = 'manageTeamGroup',
    ViewTeamGroup = 'viewTeamGroup',
    EditTeamGroup = 'editTeamGroup',
    DeleteTeamGroup = 'deleteTeamGroup',
    ManageMembers = 'manageMembers',
    InviteMembers = 'inviteMembers',
    ApproveRequests = 'approveRequests',
    RejectRequests = 'rejectRequests'
}
  
export type TeamGroupPermissions = BasePermissions<TeamGroupPermissionType>;

export interface TeamGroupData extends BaseDocumentData {
    teamId: string; // このグループが所属するチームのID
    groupName: string; // グループの名前
    iconUrl?: string; // グループのアイコン画像のURL（オプション）
    description: string; // グループの説明
    chatroomId: string; // チャットルームのID
    members: Member[]; // グループのメンバーのユーザーIDリスト
    permissions: TeamGroupPermissions; // グループ内の役割ごとの権限設定
    visibility: TeamGroupVisibility; // グループの公開設定
    invitedUsers: ActionInfo[]; // グループへの招待者のリスト
    status: TeamGroupStatus; // グループの現在のステータス
    tags: TeamGroupTag[]; // グループに関連するタグやカテゴリ
}

export const defaultTeamGroupPermissions: TeamGroupPermissions = {
    [RoleType.Admin]: [
        TeamGroupPermissionType.ManageTeamGroup,
        TeamGroupPermissionType.ViewTeamGroup,
        TeamGroupPermissionType.EditTeamGroup,
        TeamGroupPermissionType.DeleteTeamGroup,
        TeamGroupPermissionType.ManageMembers,
        TeamGroupPermissionType.InviteMembers,
        TeamGroupPermissionType.ApproveRequests,
        TeamGroupPermissionType.RejectRequests
    ],
    [RoleType.Member]: [
        TeamGroupPermissionType.ViewTeamGroup,
    ],
    [RoleType.Guest]: [
        TeamGroupPermissionType.ViewTeamGroup
    ]
  };
  