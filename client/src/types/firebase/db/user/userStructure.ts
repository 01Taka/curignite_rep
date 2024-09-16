import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";
import { Subject } from "../common/commonTypes";
import { LearningGoalStatus, PartnerStatus, UserStatus } from "./userSupplementTypes";
import { JoinRequestStatus } from "../common/joinRequest/joinRequestSupplementTypes";
import { ISODate } from "../../../util/dateTimeTypes";

/**
 * docId - userId
 */
export interface UserData extends BaseDocumentData {
  username: string;
  avatarIconId: string;
  birthTimestamp: Timestamp;

  status: UserStatus;
  currentTargetLearningGoalId: string | null;

  lastLearningTimestamp: Timestamp;
  consecutiveLearningNumber: number;
  maxConsecutiveLearningNumber: number;
  totalLearningTime: number;
}

export interface UserWithSupplementary extends UserData {
  avatarIconUrl: string;
}

export interface Session {
  startTime: Timestamp;
  endTime: Timestamp;
}

export interface UserLearningGoalData extends BaseDocumentData {
  objective: string
  subject: Subject;
  sessions: Session[];
  targetDuration: number;
  durationSpent: number | null;
  status: LearningGoalStatus;
}

/**
 * date - YYYY-MM-DDの形式で保存
 */
export interface UserDailyLearningSummaryData extends BaseDocumentData {
  date: ISODate; 
  totalDurationSpent: number;
  learningGoalIds: string[];
  learningGoalCount: number;
}

/**
 * docId - teamId
 */
export interface UserTeamData extends BaseDocumentData {
  requestedAt: Timestamp;
  status: JoinRequestStatus;
  isMember: boolean;
}

/**
 * docId - partnerUserId
 */
export interface UserPartnerData extends BaseDocumentData {
  since: Timestamp;
  status: PartnerStatus;
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