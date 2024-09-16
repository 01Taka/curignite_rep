import { CurrentSession, IndexedDBSession } from "../../../../types/browserStorage/indexedDB/learningSessionsTypes";
import { TimeTypes } from "../../../../types/util/dateTimeTypes";
import { convertToDate } from "../../../dateTimeUtils";
import { IndexedDBHandler } from "../indexedDBHandler";

export class IndexedLearningSessionService {
  private static DB_NAME = "learningSessions";
  private static version = 15;
  private static timeout = 5000;
  private static indexedDB = new IndexedDBHandler(
    this.DB_NAME, ["currentSession", "session"], this.version, this.timeout
  );

  private static getSessionDB() {
    return this.indexedDB.getStoreHandler<IndexedDBSession>("session");
  }

  private static getCurrentSessionDB() {
    return this.indexedDB.getStoreHandler<CurrentSession>("currentSession");
  }

  // セッションを保存してストアをクリアする共通メソッド
  private static async finalizePreviousSession(userId: string, learningGoalId: string, endTime: TimeTypes) {
    const prevSession = await this.getCurrentSessionDB().getData(userId, 0);
    if (prevSession) {
      await this.saveSession(userId, learningGoalId, prevSession.startTime, endTime);
      await this.getCurrentSessionDB().clearStore(userId);
    }
  }

  private static async saveSession(userId: string, learningGoalId: string, startTime: TimeTypes, endTime: TimeTypes) {
    await this.getSessionDB().addData({ uid: userId, learningGoalId, startTime: convertToDate(startTime), endTime: convertToDate(endTime) });
  }

  public static async startSession(userId: string, learningGoalId: string, startTime: TimeTypes = new Date()) {
    try {
      startTime = convertToDate(startTime);
      await this.finalizePreviousSession(userId, learningGoalId, startTime);
      await this.getCurrentSessionDB().putData({ id: 0, learningGoalId, uid: userId, startTime });
      console.log("IndexedDBSession started successfully");
    } catch (error) {
      console.error("Error starting session:", error);
    }
  }
  
  public static async endCurrentSession(userId: string, learningGoalId: string, endTime: TimeTypes = new Date()) {
    try {
      endTime = convertToDate(endTime);
      await this.finalizePreviousSession(userId, learningGoalId, endTime);
      console.log("IndexedDBSession ended successfully");
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

  public static async getAllSessions(userId: string, learningGoalId: string): Promise<IndexedDBSession[]> {
    try {
      const sessions =  await this.getSessionDB().getAllData(userId);
      return sessions.filter(session => session.learningGoalId === learningGoalId);
    } catch (error) {
      console.error("Error getting all sessions:", error);
      return [];
    }
  }

  public static async deleteCurrentSession(userId: string) {
    try {
      await this.getCurrentSessionDB().deleteData(userId, 0);
    } catch (error) {
      console.error(error);
    }
  }

  public static async clearSessions(userId: string, learningGoalId: string) {
    try {
      const sessions = await this.getAllSessions(userId, learningGoalId);
      const deletePromise = sessions.map(async session => {
        if (session.learningGoalId === learningGoalId && session.id) {
          await this.getSessionDB().deleteData(userId, session.id)
        }
      })

      await Promise.all(deletePromise);
    } catch (error) {
      console.error(error);
    }
  }

  public static async clearAllSessions(userId: string): Promise<void> {
    try {
      await this.getSessionDB().clearStore(userId);
    } catch (error) {
      console.error("Error clearing sessions:", error);
    }
  }
}