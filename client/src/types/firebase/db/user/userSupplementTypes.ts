import { Timestamp } from "firebase/firestore";

export type UserStatus = "active" | "idle" | "away" | "offline";
export type LearningGoalStatus = "inProgress" | "achieved" | "paused" | "procrastinate" | "canceled";
export type PartnerStatus = "active" | "inactive" | "blocked";

export interface UserProfileData {
  docId: string;
  username: string
  iconUrl: string;
}

export interface UserStateData {
  status: UserStatus;

  currentTargetLearningGoalId: string | null;

  lastLearningTimestamp: Timestamp;
  consecutiveLearningNumber: number;
  maxConsecutiveLearningNumber: number;
  totalLearningTime: number;
}
