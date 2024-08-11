import { DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../../base";
import { LearningSession, UserDailyLogData } from "../../../../../types/firebase/db/user/userDailyLogsTypes";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";

class UserDailyLogsDB extends BaseDB<UserDailyLogData> {
  constructor(firestore: Firestore, userId: string) {
    super(firestore, `users/${userId}/dailyLogs`);
  }

  async createUserDailyLogs(createdById: string,
    date: Timestamp,
    learningSessions: LearningSession[] = [],
    totalLearningTime: number = 0,
  ): Promise<DocumentReference<UserDailyLogData>> {
    try {
      const data: UserDailyLogData = {
        ...getInitialBaseDocumentData(createdById),
        date,
        learningSessions,
        totalLearningTime,
      };
      return await this.create(data);
    } catch (error) {
      console.error("Error creating user daily logs:", error);
      throw new Error("Failed to create user daily logs");
    }
  }

  async getUserDailyLogs(logId: string): Promise<UserDailyLogData | null> {
    try {
      return await this.read(logId);
    } catch (error) {
      console.error("Error getting user daily logs:", error);
      throw new Error("Failed to get user daily logs");
    }
  }

  async getUserDailyLogsByDate(timestamp: Timestamp) {
    try {
      return await this.getFirstMatch("date", timestamp);
    } catch (error) {
      console.error("Error getting user daily logs by date:", error);
      throw new Error("Failed to get user daily logs by date");
    }
  }

  async updateUserDailyLogs(logId: string, data: Partial<UserDailyLogData>) {
    try {
      await this.update(logId, data);
    } catch (error) {
      console.error("Error updating user daily logs:", error);
      throw new Error("Failed to update user daily logs");
    }
  }
}

export default UserDailyLogsDB;