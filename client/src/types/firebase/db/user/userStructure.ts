import { Timestamp } from "firebase/firestore";
import { BaseDocumentWrite, DocumentRead, DocumentWrite } from "../baseTypes";
import { Subject } from "../common/commonTypes";
import { LearningGoalStatus, PartnerStatus, UserStateData } from "./userSupplementTypes";
import { JoinRequestStatus } from "../common/joinRequest/joinRequestSupplementTypes";
import { ISODate } from "../../../util/dateTimeTypes";
import { TaskPlan } from "./userTaskPlanStructure";

/**
 * docId - userId
 */
interface UserData {
  username: string;
  avatarIconId: string;
  birthTimestamp: Timestamp;

  taskPlan: TaskPlan | null;
  state: UserStateData;
}

export type UserWrite = DocumentWrite<UserData>;
export interface UserRead extends DocumentRead<UserData> {
  avatarIconUrl: string;
} 


// export interface UserWithSupplementary extends UserData {
//   avatarIconUrl: string;
// }

export interface Session {
  startTime: Timestamp;
  endTime: Timestamp;
}

export interface UserLearningGoalData {
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
export interface UserDailyLearningSummaryData {
  date: ISODate; 
  totalDurationSpent: number;
  learningGoalIds: string[];
  learningGoalCount: number;
}

/**
 * docId - teamId
 */
export interface UserTeamData {
  requestedAt: Timestamp;
  status: JoinRequestStatus;
  isMember: boolean;
}

/**
 * docId - partnerUserId
 */
export interface UserPartnerData {
  since: Timestamp;
  status: PartnerStatus;
}

export interface UserHelpData {
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
export interface HelpAnswerData {
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