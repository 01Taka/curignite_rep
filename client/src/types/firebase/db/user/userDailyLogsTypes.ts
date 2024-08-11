import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";

export interface LearningSession {
  spaceId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  learningTime: number;
}

export interface UserDailyLogData extends BaseDocumentData {
  date: Timestamp;
  learningSessions: LearningSession[];
  totalLearningTime: number;
}