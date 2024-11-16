import { Timestamp } from "firebase/firestore";
import { LearningState, LobbyVisibility } from "./learningSupplementTypes";
import { BaseDocumentWrite } from "../baseTypes";

export interface LearningLobbyData extends BaseDocumentWrite {
  visibility: LobbyVisibility;
  memberCount: number;
}


/**
 * 親子関係: LearningLobbies/LearningMembers
 * ドキュメントID: UserId
 */
export interface LearningMemberData extends BaseDocumentWrite {
  state: LearningState;
  joinedAt: Timestamp;
}