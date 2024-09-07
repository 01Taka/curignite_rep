export type LearningSessionStatus = "inProgress" | "completed" | "paused" | "canceled";
export type PartnerStatus = "active" | "inactive" | "blocked";
export type GoalStatus = "inProgress" | "achieved";

export interface UserProfileData {
  docId: string;
  username: string
  iconUrl: string;
}
