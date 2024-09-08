import { Timestamp } from "firebase/firestore";
import { BaseDocumentData, BaseMemberRole } from "../baseTypes";

export interface TeamData extends BaseDocumentData {
  teamName: string;
  iconId: string;
  description: string;
  requiresApproval: boolean;
  chatRoomId: string,
}

export interface TeamWithSupplementary extends TeamData {
  iconUrl: string
}

/**
 * docId - userId
 */
export interface TeamMemberData extends BaseDocumentData {
  joinedAt: Timestamp;
  role: BaseMemberRole;
}
