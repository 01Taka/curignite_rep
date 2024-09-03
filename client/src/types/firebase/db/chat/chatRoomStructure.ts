import { Timestamp } from "firebase/firestore";
import { BaseDocumentData, BaseMemberRole } from "../baseTypes";
import { ChatRoomRelationships, ChatStatusType } from "./chatRoomSupplementTypes";


export interface ChatRoomData extends BaseDocumentData {
  roomName: string;
  relationships: ChatRoomRelationships;
}

export interface ChatRoomMemberData extends BaseDocumentData {
    joinedAt: Timestamp;
    role: BaseMemberRole;
}

/**
 * createdBy - senderId
 */
export interface ChatData extends BaseDocumentData {
  content: string;
  fileUrls: string[];
  status: {
      overall: ChatStatusType;
      memberStatus: { [memberId: string]: ChatStatusType };
  };
  replyTo: string; // 返信対象のメッセージID、返信がない場合は省略される
  // threadId: string; // スレッドID、スレッドがない場合は省略される
}

// export interface ChatRoomThreadData extends BaseDocumentData {
//   title: string;
//   status: ChatThreadStatus;
//   participantsId: string[]
// }