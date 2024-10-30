import { Timestamp } from "firebase/firestore";
import { LearningState, LobbyVisibility } from "./learningSupplementTypes";
import { BaseDocumentData } from "../baseTypes";

export interface LearningLobbyData extends BaseDocumentData {
  visibility: LobbyVisibility;
  memberCount: number;
}


/**
 * 親子関係: LearningLobbies/LearningMembers
 * ドキュメントID: UserId
 */
export interface LearningMemberData extends BaseDocumentData {
  state: LearningState;
  joinedAt: Timestamp;
}