export type LearningSessionStatus = "inProgress" | "completed" | "paused" | "canceled";
export type PartnerStatus = "active" | "inactive" | "blocked";
export type GoalStatus = "notStarted" | "inProgress" | "achieved" | "expired";

export interface UserProfileData {
  docId: string;
  username: string
  iconUrl: string;
}
