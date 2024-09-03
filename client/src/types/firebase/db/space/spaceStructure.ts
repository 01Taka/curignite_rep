import { Timestamp } from "firebase/firestore";
import { BaseDocumentData, BaseMemberRole } from "../baseTypes";

export interface SpaceData extends BaseDocumentData {
  spaceName: string;
  description: string;
  requiresApproval: boolean;
  chatRoomId: string;
}

/**
 * docId - userId
 */
export interface SpaceMemberData extends BaseDocumentData {
  isAway: boolean;
  joinedAt: Timestamp;
  role: BaseMemberRole;
}

// // TODO: SpaceInvitationDBを作成
// export interface SpaceInvitationData extends BaseDocumentData {
//   state: SpaceInvitationState;
//   invitedAt: Timestamp;
//   responseAt?: Timestamp
// }
