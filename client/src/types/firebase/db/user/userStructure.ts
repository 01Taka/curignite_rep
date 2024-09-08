import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";
import { Subject } from "../common/commonTypes";
import { GoalStatus, PartnerStatus } from "./userSupplementTypes";
import { JoinRequestStatus } from "../common/joinRequest/joinRequestSupplementTypes";

/**
 * docId - userId
 */
export interface UserData extends BaseDocumentData {
  username: string;
  avatarIconId: string;
  birthTimestamp: Timestamp;

  isLearning: boolean;
  currentTargetGoalId: string | null;

  lastLearningTimestamp: Timestamp;
  consecutiveLearningNumber: number;
  totalLearningTime: number;
}

export interface UserWithSupplementary extends UserData {
  avatarIconUrl: string;
}

export interface SessionData {
  startTime: Timestamp;
  endTime: Timestamp;
}

/**
 * date - 00:00:00に設定
 */
export interface UserLearningSessionData extends BaseDocumentData {
  date: Timestamp;
  sessions: SessionData[];
  totalLearningTime: number;
  sessionCount: number;
}

/**
 * docId - teamId
 */
export interface UserTeamData extends BaseDocumentData {
  requestedAt: Timestamp;
  status: JoinRequestStatus;
}

/**
 * docId - partnerUserId
 */
export interface UserPartnerData extends BaseDocumentData {
  since: Timestamp;
  status: PartnerStatus;
}

export interface UserGoalData extends BaseDocumentData {
  objectives: string;
  subject: Subject;
  deadline: Timestamp;
  status: GoalStatus;
}

export interface UserHelpData extends BaseDocumentData {
  subject: Subject;
  question: string;
  fileIds: string[];
  solved: boolean;
  bestAnswerId: string | null;
}

/**
 * Users/UserHelps/
 * createdAt - answeredAt
 */
export interface HelpAnswerData extends BaseDocumentData {
  answer: string;
  fileIds: string[];
  answeredBy: string;
}




export interface HelpAndAnswersWithFileUrls {
  help: UserHelpData;
  helpFileUrls: string[];
  answers: HelpAnswerData[];
  answersFileUrls: Record<string, string[]>
}