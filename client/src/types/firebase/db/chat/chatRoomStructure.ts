import { Timestamp } from "firebase/firestore";
import { BaseDocumentWrite, BaseMemberRole } from "../baseTypes";
import { ChatRoomRelationships, ChatStatusType } from "./chatRoomSupplementTypes";


export interface ChatRoomData extends BaseDocumentWrite {
  roomName: string;
  relationships: ChatRoomRelationships;
}

export interface ChatRoomMemberData extends BaseDocumentWrite {
    joinedAt: Timestamp;
    role: BaseMemberRole;
}

/**
 * createdBy - senderId
 */
export interface ChatData extends BaseDocumentWrite {
  content: string;
  fileUrls: string[];
  status: {
      overall: ChatStatusType;
      memberStatus: { [memberId: string]: ChatStatusType };
  };
  replyTo: string; // 返信対象のメッセージID、返信がない場合は省略される
  // threadId: string; // スレッドID、スレッドがない場合は省略される
}

// export interface ChatRoomThreadData extends BaseDocumentWrite {
//   title: string;
//   status: ChatThreadStatus;
//   participantsId: string[]
// }