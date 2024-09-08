import { CurrentSession, Session } from "../../../../types/browserStorage/indexedDB/learningSessionsTypes";
import { TimeTypes } from "../../../../types/util/dateTimeTypes";
import { convertToDate } from "../../../dateTimeUtils";
import { IndexedDBHandler } from "../indexedDBHandler";

export class IndexedLearningSessionService {
  private static DB_NAME = "learningSessions";
  private static version = 14;
  private static timeout = 5000;
  private static indexedDB = new IndexedDBHandler(
    this.DB_NAME, ["currentSession", "session"], this.version, this.timeout
  );

  private static getSessionDB() {
    return this.indexedDB.getStoreHandler<Session>("session");
  }

  private static getCurrentSessionDB() {
    return this.indexedDB.getStoreHandler<CurrentSession>("currentSession");
  }

  // セッションを保存してストアをクリアする共通メソッド
  private static async finalizePreviousSession(userId: string, endTime: TimeTypes) {
    const prevSession = await this.getCurrentSessionDB().getData(userId, 0);
    if (prevSession) {
      await this.saveSession(userId, prevSession.startTime, endTime);
      await this.getCurrentSessionDB().clearStore(userId);
    }
  }

  private static async saveSession(userId: string, startTime: TimeTypes, endTime: TimeTypes) {
    await this.getSessionDB().addData({ uid: userId, startTime: convertToDate(startTime), endTime: convertToDate(endTime) });
  }

  public static async startSession(userId: string, startTime: TimeTypes = new Date()) {
    try {
      startTime = convertToDate(startTime);
      await this.finalizePreviousSession(userId, startTime);
      await this.getCurrentSessionDB().putData({ id: 0, uid: userId, startTime });
      console.log("Session started successfully");
    } catch (error) {
      console.error("Error starting session:", error);
    }
  }
  
  public static async endSession(userId: string, endTime: TimeTypes = new Date()) {
    try {
      endTime = convertToDate(endTime);
      await this.finalizePreviousSession(userId, endTime);
      console.log("Session ended successfully");
    } catch (error) {
      console.error("Error ending session:", error);
    }
  }

  public static async getCurrentSession(userId: string): Promise<CurrentSession | null> {
    try {
      return await this.getCurrentSessionDB().getData(userId, 0);
    } catch (error) {
      console.error("Error getting current session:", error);
      return null;
    }
  }

  public static async getAllSessions(userId: string): Promise<Session[]> {
    try {
      return await this.getSessionDB().getAllData(userId);
    } catch (error) {
      console.error("Error getting all sessions:", error);
      return [];
    }
  }

  public static async deleteCurrentSession(userId: string) {
    try {
      await this.getCurrentSessionDB().deleteData(userId, 0);
    } catch (error) {
      console.log(error);
    }
  }

  public static async clearSessions(userId: string): Promise<void> {
    try {
      await this.getSessionDB().clearStore(userId);
    } catch (error) {
      console.error("Error clearing sessions:", error);
    }
  }
}