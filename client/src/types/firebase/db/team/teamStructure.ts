import { Timestamp } from "firebase/firestore";
import { BaseDocumentData, BaseMemberRole } from "../baseTypes";

export interface TeamData extends BaseDocumentData {
  teamName: string;
  iconUrl: string;
  description: string;
  requiresApproval: boolean;
  chatRoomId: string,
}

/**
 * docId - userId
 */
export interface TeamMemberData extends BaseDocumentData {
  joinedAt: Timestamp;
  role: BaseMemberRole;
}
