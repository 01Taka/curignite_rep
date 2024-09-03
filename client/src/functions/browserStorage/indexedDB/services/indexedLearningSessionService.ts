import { TimeTypes } from "../../../../types/util/dateTimeTypes";
import { toDate } from "../../../dateTimeUtils";
import { CurrentSession, Session } from "../../../../types/browserStorage/indexedDB/learningSessionsTypes";

export class IndexedLearningSessionService {
  private static currentSessionDB: IndexedDBHandler<CurrentSession> = new IndexedDBHandler<CurrentSession>("learningSessions", "currentSession", 1);
  private static sessionDB: IndexedDBHandler<Session> = new IndexedDBHandler<Session>("learningSessions", "sessions", 1);

  public static async startSession(startTime: TimeTypes = new Date()) {
    try {
      startTime = toDate(startTime);
      const prevSession = await this.currentSessionDB.getData(0);

      if (prevSession) {
        await this.sessionDB.addData({ startTime: prevSession.startTime, endTime: startTime });
        await this.currentSessionDB.clearStore();
      }

      await this.currentSessionDB.addData({ id: 0, startTime });
    } catch (error) {
      console.error('Error starting session:', error);
    }
  }

  public static async endSession(endTime: TimeTypes = new Date()) {
    try {
      endTime = toDate(endTime);
      const currentSession = await this.currentSessionDB.getData(0);
      if (currentSession) {
        await this.sessionDB.addData({ startTime: currentSession.startTime, endTime });
        await this.currentSessionDB.clearStore();
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }
  
  // 全セッションの取得
  public static async getAllSessions(): Promise<Session[]> {
    try {
      return await this.sessionDB.getAllData();
    } catch (error) {
      console.error('Error getting all sessions:', error);
      return []; // エラーが発生した場合は空の配列を返す
    }
  }

  // 全セッションのクリア
  public static async clearSessions(): Promise<void> {
    try {
      await this.sessionDB.clearStore();
    } catch (error) {
      console.error('Error clearing sessions:', error);
    }
  }
}
