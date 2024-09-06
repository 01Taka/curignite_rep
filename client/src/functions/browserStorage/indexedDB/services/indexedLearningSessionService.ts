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
  private static async finalizePreviousSession(endTime: TimeTypes) {
    const prevSession = await this.getCurrentSessionDB().getData(0);
    if (prevSession) {
      await this.saveSession(prevSession.startTime, endTime);
      await this.getCurrentSessionDB().clearStore();
    }
  }

  private static async saveSession(startTime: TimeTypes, endTime: TimeTypes) {
    await this.getSessionDB().addData({ startTime: convertToDate(startTime), endTime: convertToDate(endTime) });
  }

  public static async startSession(startTime: TimeTypes = new Date()) {
    try {
      startTime = convertToDate(startTime);
      await this.finalizePreviousSession(startTime);
      await this.getCurrentSessionDB().addData({ id: 0, startTime });
      console.log("Session started successfully");
    } catch (error) {
      console.error("Error starting session:", error);
    }
  }
  
  public static async endSession(endTime: TimeTypes = new Date()) {
    try {
      endTime = convertToDate(endTime);
      await this.finalizePreviousSession(endTime);
      console.log("Session ended successfully");
    } catch (error) {
      console.error("Error ending session:", error);
    }
  }

  public static async getCurrentSession(): Promise<CurrentSession | null> {
    try {
      return await this.getCurrentSessionDB().getData(0);
    } catch (error) {
      console.error("Error getting current session:", error);
      return null;
    }
  }

  public static async getAllSessions(): Promise<Session[]> {
    try {
      return await this.getSessionDB().getAllData();
    } catch (error) {
      console.error("Error getting all sessions:", error);
      return [];
    }
  }

  public static async clearSessions(): Promise<void> {
    try {
      await this.getSessionDB().clearStore();
    } catch (error) {
      console.error("Error clearing sessions:", error);
    }
  }
}