import { DocumentReference, Firestore, Timestamp, where } from "firebase/firestore";
import { ISODate, TimeTypes } from "../../../../../types/util/dateTimeTypes";
import { convertToMilliseconds, getMidnightTimestamp, convertToDate, toISODate, toTimestamp } from "../../../../../functions/dateTimeUtils";
import { getMinAndMaxFromObjectArray } from "../../../../../functions/objectUtils";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { startOfWeek } from "date-fns";
import { safeNumber } from "../../../../../functions/utils";
import { SessionData, UserLearningSessionData } from "../../../../../types/firebase/db/user/userStructure";
import { DAYS_IN_MILLISECOND } from "../../../../../constants/utils/dateTimeConstants";

export class UserLearningSessionService {
  constructor(private firestore: Firestore) {}

  private createBaseDB(userId: string): BaseDB<UserLearningSessionData> {
    return new BaseDB(this.firestore, `users/${userId}/sessions`);
  }

  private async validateTotalLearningTime(totalLearningTime: number): Promise<void> {
    if (isNaN(totalLearningTime) || totalLearningTime < 0) {
      throw new Error(`Invalid totalLearningTime: ${totalLearningTime}`);
    }
  }

  async createOrUpdateDailySession(
    userId: string,
    date: TimeTypes,
    totalLearningTime: number = 0,
  ): Promise<DocumentReference<UserLearningSessionData>> {
    await this.validateTotalLearningTime(totalLearningTime);

    try {
      const dailySession = await this.fetchDailySession(userId, date);
      if (dailySession) {
        await this.createBaseDB(userId).update(dailySession.docId, { ...dailySession, totalLearningTime });
        const snapshot = await this.createBaseDB(userId).readAsDocumentSnapshot(dailySession.docId);
        return snapshot.ref;
      }

      const data: UserLearningSessionData = {
        ...getInitialBaseDocumentData(userId),
        date: getMidnightTimestamp(date),
        sessions: [],
        totalLearningTime,
        sessionCount: 0,
      };
      return await this.createBaseDB(userId).create(data);
    } catch (error) {
      console.error(`Failed to create or update daily session: ${error}`);
      throw error;
    }
  }

  async fetchDailySession(userId: string, date: TimeTypes = new Date()): Promise<UserLearningSessionData | null> {
    try {
      return await this.createBaseDB(userId).getFirstMatch("date", getMidnightTimestamp(date));
    } catch (error) {
      console.error(`Failed to fetch daily session: ${error}`);
      throw error;
    }
  }

  async isExistSession(userId: string, date: TimeTypes): Promise<boolean> {
    return !!await this.fetchDailySession(userId, date);
  }

  async fetchOrCreateDailySession(userId: string, date: TimeTypes): Promise<UserLearningSessionData> {
    try {
      let sessionData = await this.fetchDailySession(userId, date);
      if (!sessionData) {
        await this.createOrUpdateDailySession(userId, date);
        sessionData = await this.fetchDailySession(userId, date);
      }
      return sessionData!;
    } catch (error) {
      console.error(`Failed to fetch or create daily session: ${error}`);
      throw error;
    }
  }

  async fetchRecentSessions(userId: string, borderDate: TimeTypes): Promise<UserLearningSessionData[]> {
    try {
      const borderTimestamp = getMidnightTimestamp(borderDate);
      return await this.createBaseDB(userId).getAll(where("date", ">=", borderTimestamp));
    } catch (error) {
      console.error(`Failed to fetch recent sessions: ${error}`);
      throw error;
    }
  }

  async fetchWeeklySessions(userId: string, targetDate: TimeTypes = new Date()): Promise<UserLearningSessionData[]> {
    try {
      const weekStart = startOfWeek(convertToDate(targetDate));
      return await this.fetchRecentSessions(userId, weekStart);
    } catch (error) {
      console.error(`Failed to fetch weekly sessions: ${error}`);
      throw error;
    }
  }

  async fetchRecentSessionsByDaysAgo(userId: string, daysAgo: number, fromStartOfWeek: boolean = false, baseDate: TimeTypes = new Date()): Promise<UserLearningSessionData[]> {
    try {
      const millisDiff = convertToMilliseconds(baseDate) - daysAgo * DAYS_IN_MILLISECOND;
      const diff: TimeTypes = fromStartOfWeek ? startOfWeek(convertToDate(millisDiff)) : millisDiff;
      return await this.fetchRecentSessions(userId, diff);
    } catch (error) {
      console.error(`Failed to fetch recent sessions by days ago: ${error}`);
      throw error;
    }
  }

  async recordSession(
    userId: string, 
    learningTime: number, 
    startTime: TimeTypes, 
    endTime: TimeTypes = Timestamp.now(), 
    targetDate: TimeTypes = new Date()
  ): Promise<void> {
    try {
      const session: SessionData = {
        startTime: toTimestamp(startTime),
        endTime: toTimestamp(endTime),
      };

      const sessionData = await this.fetchOrCreateDailySession(userId, targetDate);
      const newTotalLearningTime = safeNumber(sessionData.totalLearningTime) + safeNumber(learningTime);

      const newSessions = [...sessionData.sessions, session];

      await this.createBaseDB(userId).update(sessionData.docId, {
        sessions: newSessions,
        totalLearningTime: newTotalLearningTime,
        sessionCount: newSessions.length,
      });
    } catch (error) {
      console.error(`Failed to record session: ${error}`);
      throw error;
    }
  }

  static mapLearningTimeByDate(sessions: UserLearningSessionData[]): Record<ISODate, number> {
    return sessions.reduce((acc, session) => {
      const isoDate = toISODate(session.date);
      acc[isoDate] = (acc[isoDate] || 0) + session.totalLearningTime;
      return acc;
    }, {} as Record<ISODate, number>);
  }

  static calculateTotalLearningTime(sessions: UserLearningSessionData[]): number {
    return sessions.reduce((sum, session) => sum + session.totalLearningTime, 0);
  }

  static calculateAverageLearningTime(
    sessions: UserLearningSessionData[], 
    denoType: number | "length" | "dateDiff" = "dateDiff"
  ): number {
    if (sessions.length === 0) return 0;

    const total = this.calculateTotalLearningTime(sessions);
    let deno: number;

    if (typeof denoType === "number") {
      deno = denoType >= 1 ? denoType : 1;
    } else if (denoType === "length") {
      deno = sessions.length;
    } else {
      const { min, max } = getMinAndMaxFromObjectArray(sessions, "date");
      const diff = convertToMilliseconds(max as Timestamp) - convertToMilliseconds(min as Timestamp);
      deno = Math.floor(diff / DAYS_IN_MILLISECOND);
    }

    return deno === 0 ? sessions[0].totalLearningTime : total / deno;
  }

  async calculateWeeklyTotalLearningTime(userId: string): Promise<number> {
    try {
      const sessions = await this.fetchWeeklySessions(userId);
      return UserLearningSessionService.calculateTotalLearningTime(sessions);
    } catch (error) {
      console.error(`Failed to calculate weekly total learning time: ${error}`);
      throw error;
    }
  }

  async calculateRecentDaysAverageLearningTime(userId: string, days: number = 30): Promise<number> {
    try {
      const sessions = await this.fetchRecentSessionsByDaysAgo(userId, days);
      return UserLearningSessionService.calculateAverageLearningTime(sessions, days);
    } catch (error) {
      console.error(`Failed to calculate recent days average learning time: ${error}`);
      throw error;
    }
  }
}
