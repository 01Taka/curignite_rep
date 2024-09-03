import { DocumentReference, Firestore, Timestamp, where } from "firebase/firestore";
import { DAYS_IN_MILLISECOND, ISODate, TimeTypes } from "../../../../../types/util/dateTimeTypes";
import { convertToMilliseconds, getMidnightTimestamp, toDate, toISODate, toTimestamp } from "../../../../../functions/dateTimeUtils";
import { getMinAndMaxFromObjectArray } from "../../../../../functions/objectUtils";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { startOfWeek } from "date-fns";
import { safeNumber } from "../../../../../functions/utils";
import { SessionData, UserLearningSessionData } from "../../../../../types/firebase/db/user/userStructure";

export class UserLearningSessionService {
  constructor(
    private firestore: Firestore,
  ) {}

  createBaseDB(userId: string): BaseDB<UserLearningSessionData> {
    return new BaseDB(this.firestore, `users/${userId}/sessions`);
  }

    /**
   * 新しいユーザーの日次ログドキュメントをFirestoreに作成します。
   * @param createdById ログを作成したユーザーのID。
   * @param date ログの日付を示すタイムスタンプ。
   * @param learningSessions ログに含める学習セッションの配列。
   * @param totalLearningTime 合計学習時間（秒単位）。
   * @param errorIfExist 既存のログがある場合に作成をエラーをスローするかどうか（デフォルトはtrue）。
   * @returns 新しく作成されたログのDocumentReferenceを含むPromise。既存のログがある場合はnullを返します。
   */
    async createDailySessions(
      userId: string,
      date: TimeTypes,
      totalLearningTime: number = 0,
      errorIfExist: boolean = true,
    ): Promise<DocumentReference<UserLearningSessionData>> {
      if (errorIfExist && await this.isExistSession(userId, date)) {
        throw new Error(`the day session is exist: ${date}`);
      }
  
      if (isNaN(totalLearningTime)) {
        throw new Error(`Invalid totalLearningTime: ${totalLearningTime}`);
      }
  
      const data: UserLearningSessionData = {
        ...getInitialBaseDocumentData(userId),
        date: getMidnightTimestamp(date),
        sessions: [],
        totalLearningTime,
        sessionCount: 0,
      };
      return await this.createBaseDB(userId).create(data);
    }
  
    /**
     * 指定された日付の日次ログを取得します。
     * @param date ログの日付（デフォルトは現在の日付）。
     * @returns 指定された日付のUserDailySessionDataを含むPromise。見つからなかった場合はnull。
     */
    async getDailySession(userId: string, date: TimeTypes = new Date()): Promise<UserLearningSessionData | null> {
      return await this.createBaseDB(userId).getFirstMatch("date", getMidnightTimestamp(date));
    }
  
    /**
     * 指定された日付の日次ログが存在するか確認します。
     * @param date ログの日付。
     * @returns ログが存在する場合はtrue、存在しない場合はfalseを返すPromise。
     */
    async isExistSession(userId: string, date: TimeTypes): Promise<boolean> {
      return !!await this.getDailySession(userId, date);
    }
  
    /**
     * 指定された日付の日次ログを取得または作成します。
     * @param userId ユーザーID。
     * @param date ログの日付。
     * @returns UserDailySessionDataを含むPromise。
     */
    async getOrCreateDailySession(userId: string, date: TimeTypes): Promise<UserLearningSessionData> {
      let sessionData = await this.getDailySession(userId, date);
      if (!sessionData) {
        await this.createDailySessions(userId, date);
        sessionData = await this.getDailySession(userId, date);
      }
      return sessionData!;
    }
  
    /**
     * 指定された境界日以降のすべてのユーザーの日次ログを取得します。
     * @param borderDate 取得を開始する日付。
     * @returns UserDailySessionDataの配列を含むPromise。
     */
    async getLatestSessions(userId: string, borderDate: TimeTypes): Promise<UserLearningSessionData[]> {
      const borderTimestamp = getMidnightTimestamp(borderDate);
      return await this.createBaseDB(userId).getAll(where("date", ">=", borderTimestamp));
    }
  
    /**
     * 週ごとの日次ログを取得します。
     * @param targetDate 対象の日付（デフォルトは現在の日付）。
     * @returns 週ごとのUserDailySessionDataの配列を含むPromise。
     */
    async getWeeklySessions(userId: string, targetDate: TimeTypes = new Date()): Promise<UserLearningSessionData[]> {
      const weekStart = startOfWeek(toDate(targetDate));
      return await this.getLatestSessions(userId, weekStart);
    }
  
    /**
     * 指定された日数前からの最新のログを取得します。
     * @param daysAgo 日数前。
     * @param fromStartOfWeek 週の開始日からの取得を行うか（デフォルトはfalse）。
     * @param baseDate 基準日（デフォルトは現在の日付）。
     * @returns 指定された日数前からのUserDailySessionDataの配列を含むPromise。
     */
    async getLatestSessionsByDaysAgo(userId: string, daysAgo: number, fromStartOfWeek: boolean = false, baseDate: TimeTypes = new Date()): Promise<UserLearningSessionData[]> {
      const millisDiff = convertToMilliseconds(baseDate) - daysAgo * DAYS_IN_MILLISECOND;
      const diff: TimeTypes = fromStartOfWeek ? startOfWeek(toDate(millisDiff)) : millisDiff;
      return await this.getLatestSessions(userId, diff);
    }
    
    /**
     * 学習セッションデータを追加します。
     * @param userId ユーザーID。
     * @param spaceId 学習スペースID。
     * @param learningTime 学習時間（秒単位）。
     * @param startTime 学習開始時間。
     * @param endTime 学習終了時間（デフォルトは現在のタイムスタンプ）。
     * @param targetDate 対象の日付（デフォルトは現在の日付）。
     */
    async addSessionData(
      userId: string, 
      learningTime: number, 
      startTime: TimeTypes, 
      endTime: TimeTypes = Timestamp.now(), 
      targetDate: TimeTypes = new Date()
    ): Promise<void> {
      const session: SessionData = {
        startTime: toTimestamp(startTime),
        endTime: toTimestamp(endTime),
      };
  
      const sessionData = await this.getOrCreateDailySession(userId, targetDate);
      const newTotalLearningTime = safeNumber(sessionData.totalLearningTime) + safeNumber(learningTime);

      const newSessions = [...sessionData.sessions, session]
  
      await this.createBaseDB(userId).update(sessionData.docId, {
        sessions: newSessions,
        totalLearningTime: newTotalLearningTime,
        sessionCount: newSessions.length,
      });
    }
  
  /**
   * 日次ログの配列から学習時間のマップを取得します。
   * @param sessions UserDailySessionDataの配列。
   * @returns ISODateをキー、学習時間を値とするマップ。
   */
  convertToSessionsMapByDate(sessions: UserLearningSessionData[]): Record<ISODate, number> {
    return sessions.reduce((acc, session) => {
      const isoDate = toISODate(session.date);
      acc[isoDate] = (acc[isoDate] || 0) + session.totalLearningTime;
      return acc;
    }, {} as Record<ISODate, number>);
  }

  /**
   * 日次ログの配列から総学習時間を計算します。
   * @param sessions UserDailySessionDataの配列。
   * @returns 総学習時間。
   */
  getTotalLearningTimeBySessions(sessions: UserLearningSessionData[]): number {
    return sessions.reduce((sum, session) => sum + session.totalLearningTime, 0);
  }

  /**
   * 平均学習時間を計算します。
   * @param sessions UserDailySessionDataの配列。
   * @param denoType 平均の分母を決定するタイプ（デフォルトは"dateDiff"）。
   * @returns 平均学習時間。
   */
  getAvgLearningTime(sessions: UserLearningSessionData[], denoType: number | "length" | "dateDiff" = "dateDiff"): number {
    if (sessions.length === 0) return 0;

    const total = this.getTotalLearningTimeBySessions(sessions);
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

  // 週ごとの学習時間合計を取得するメソッド
  async getWeeklyTotalLearningTime(userId: string): Promise<number> {
    const sessions = await this.getWeeklySessions(userId);
    return this.getTotalLearningTimeBySessions(sessions);
  }

  // 指定した日数の平均学習時間を取得するメソッド
  async getRecentDaysAvg(userId: string, days: number = 30): Promise<number> {
    const sessions = await this.getLatestSessionsByDaysAgo(userId, days);
    return this.getAvgLearningTime(sessions, days);
  }
}
