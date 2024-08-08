import { ConvertTimestampToNumber } from "../../../../functions/db/dbUtils";
import { ActionInfo, BaseDocumentData, BasePermissions, Member, RoleType } from "../baseTypes";
import { SelectItem } from "../../../util/componentsTypes";

export enum SpacePermissionType {
  ManageSpace = 'manageSpace',
  ViewSpace = 'viewSpace',
  EditSpace = 'editSpace',
  DeleteSpace = 'deleteSpace',
  ManageMembers = 'manageMembers',
  InviteMembers = 'inviteMembers',
  ApproveRequests = 'approveRequests',
  RejectRequests = 'rejectRequests'
}

export type SpacePermissions = BasePermissions<SpacePermissionType>;

export enum SpacePublicationTarget {
  Team = "team",
  Friend = "friend",
  Private = "private"
}

export interface SpaceData extends BaseDocumentData {
  spaceName: string;
  iconUrl?: string;
  description?: string;
  requiresApproval: boolean;
  publicationTarget: SpacePublicationTarget;
  members: Member[];
  permissions: SpacePermissions;
  pendingRequests: ActionInfo[];
  approvedUsers: ActionInfo[];
  invitedUsers: ActionInfo[];
  rejectedUsers: ActionInfo[];
  chatRoomId: string;
}
export type SerializableSpaceData = ConvertTimestampToNumber<SpaceData>;

export const defaultSpacePermissions: SpacePermissions = {
  [RoleType.Admin]: [
      SpacePermissionType.ManageSpace,
      SpacePermissionType.ViewSpace,
      SpacePermissionType.EditSpace,
      SpacePermissionType.DeleteSpace,
      SpacePermissionType.ManageMembers,
      SpacePermissionType.InviteMembers,
      SpacePermissionType.ApproveRequests,
      SpacePermissionType.RejectRequests
  ],
  [RoleType.Member]: [
      SpacePermissionType.ViewSpace,
  ],
  [RoleType.Guest]: [
      SpacePermissionType.ViewSpace
  ]
};

export interface UserSpaceIds {
  userId: string;
  spaceIds: string[];
}

export type SpaceJoinState = "participated" | "requesting" | "approved" | "rejected" | "noInfo" | "error";

// PublicationTarget 用の SelectItem 定義
export const publicationTargetForSelect: SelectItem<SpacePublicationTarget>[] = [
  { label: "チーム", value: SpacePublicationTarget.Team },
  { label: "フレンド", value: SpacePublicationTarget.Friend },
  { label: "非公開", value: SpacePublicationTarget.Private },
];