import { Timestamp } from "firebase/firestore";
import { BaseDocumentWrite, BaseMemberRole } from "../baseTypes";

export interface TeamData extends BaseDocumentWrite {
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
export interface TeamMemberData extends BaseDocumentWrite {
  joinedAt: Timestamp;
  role: BaseMemberRole;
}
