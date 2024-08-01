import { BaseDocumentData, BasePermissions, Member, RoleType } from "../baseTypes";
import { ConvertTimestampToNumber } from "../../../../functions/db/dbUtils";

export type ChatRoomParentType = "group" | "space" | "friend";

export enum ChatRoomPermissionType {
    ManageChatRoom = 'manageChatRoom',
    ViewChatRoom = 'viewChatRoom',
    EditChatRoom = 'editChatRoom',
    DeleteChatRoom = 'deleteChatRoom',
    ManageMembers = 'manageMembers',
    InviteMembers = 'inviteMembers',
    ApproveRequests = 'approveRequests',
    RejectRequests = 'rejectRequests'
}
  
export type ChatRoomPermissions = BasePermissions<ChatRoomPermissionType>;

export interface ChatRoomData extends BaseDocumentData {
    roomName: string;
    roomIconUrl: string;
    parentId: string;
    parentType: ChatRoomParentType;
    members: Member[];
    permissions: ChatRoomPermissions;
    messageCount: number;
}

export type SerializableChatRoomData = ConvertTimestampToNumber<ChatRoomData>;

export const defaultChatRoomPermissions: ChatRoomPermissions = {
    [RoleType.Admin]: [
        ChatRoomPermissionType.ManageChatRoom,
        ChatRoomPermissionType.ViewChatRoom,
        ChatRoomPermissionType.EditChatRoom,
        ChatRoomPermissionType.DeleteChatRoom,
        ChatRoomPermissionType.ManageMembers,
        ChatRoomPermissionType.InviteMembers,
        ChatRoomPermissionType.ApproveRequests,
        ChatRoomPermissionType.RejectRequests
    ],
    [RoleType.Member]: [
        ChatRoomPermissionType.ViewChatRoom,
    ],
    [RoleType.Guest]: [
        ChatRoomPermissionType.ViewChatRoom
    ]
  };
  