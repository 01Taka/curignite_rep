import { DocumentReference, Timestamp } from "firebase/firestore";
import { LearningSession, UserDailyLogData } from "../../../../../types/firebase/db/user/userDailyLogsTypes";
import UserDailyLogsDB from "./userDailyLogs";
import { TimeTypes } from "../../../../../types/util/dateTimeTypes";
import { getMidnightTimestamp, toTimestamp } from "../../../../../functions/dateTimeUtils";

export class UserDailyLogService {
  constructor(private getUserDailyLogsDBInstance: (userId: string) => UserDailyLogsDB) {}

  async createDailyLog(userId: string, date: TimeTypes = new Date(), learningSessions: LearningSession[] = [], totalLearningTime: number = 0): Promise<DocumentReference<UserDailyLogData>> {
    try {
      const midnightDate = getMidnightTimestamp(date);
      const userDailyLogsDB = this.getUserDailyLogsDBInstance(userId);
      return await userDailyLogsDB.createUserDailyLogs(userId, midnightDate, learningSessions, totalLearningTime);
    } catch (error) {
      console.error("Error creating daily log:", error);
      throw new Error("Failed to create daily log");
    }
  }

  async getDailyLog(userId: string, dateTime: TimeTypes = new Date()): Promise<UserDailyLogData | null> {
    try {
      const date = getMidnightTimestamp(dateTime);
      const userDailyLogsDB = this.getUserDailyLogsDBInstance(userId);
      return await userDailyLogsDB.getUserDailyLogsByDate(date);
    } catch (error) {
      console.error("Error getting daily log:", error);
      throw new Error("Failed to get daily log");
    }
  }

  async addSessionData(userId: string, spaceId: string, learningTime: number, startTime: TimeTypes, endTime: TimeTypes = Timestamp.now()) {
    try {
      const userDailyLogsDB = this.getUserDailyLogsDBInstance(userId);

      const session: LearningSession = {
        spaceId,
        startTime: toTimestamp(startTime),
        endTime: toTimestamp(endTime),
        learningTime,
      };

      const todayMidnight = getMidnightTimestamp();
      const logData = await userDailyLogsDB.getUserDailyLogsByDate(todayMidnight);
      console.log("ADD", logData);
      
      if (logData) {
        await userDailyLogsDB.updateUserDailyLogs(logData.docId, {
          learningSessions: [...logData.learningSessions, session],
          totalLearningTime: Number(logData.totalLearningTime) + Number(learningTime),
        });
      } else {
        await this.createDailyLog(userId, todayMidnight, [session], learningTime);
      }
    } catch (error) {
      console.error("Error adding session data:", error);
      throw new Error("Failed to add session data");
    }
  }
}