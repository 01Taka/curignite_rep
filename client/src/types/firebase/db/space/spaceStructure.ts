import { Timestamp } from "firebase/firestore";
import { BaseDocumentWrite, BaseMemberRole } from "../baseTypes";

export interface SpaceData extends BaseDocumentWrite {
  spaceName: string;
  description: string;
  requiresApproval: boolean;
  chatRoomId: string;
}

/**
 * docId - userId
 */
export interface SpaceMemberData extends BaseDocumentWrite {
  isAway: boolean;
  joinedAt: Timestamp;
  role: BaseMemberRole;
}

// // TODO: SpaceInvitationDBを作成
// export interface SpaceInvitationData extends BaseDocumentWrite {
//   state: SpaceInvitationState;
//   invitedAt: Timestamp;
//   responseAt?: Timestamp
// }
