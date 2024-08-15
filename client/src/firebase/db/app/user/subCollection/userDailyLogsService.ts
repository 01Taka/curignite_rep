import { DocumentReference, Timestamp } from "firebase/firestore";
import { LearningSession, UserDailyLogData } from "../../../../../types/firebase/db/user/userDailyLogsTypes";
import UserDailyLogsDB from "./userDailyLogs";
import { DAYS_IN_MILLISECOND, ISODate, TimeTypes } from "../../../../../types/util/dateTimeTypes";
import { convertToMilliseconds, getMidnightTimestamp, toDate, toISODate, toTimestamp } from "../../../../../functions/dateTimeUtils";
import { startOfWeek } from "date-fns";
import { getMinAndMaxFromObjectArray } from "../../../../../functions/objectUtils";

export class UserDailyLogService {
  constructor(private getUserDailyLogsDBInstance: (userId: string) => UserDailyLogsDB) {}

  /**
   * 日次ログを作成します。
   * @param userId ユーザーID。
   * @param date ログの日付（デフォルトは現在の日付）。
   * @param learningSessions ログに含める学習セッション（デフォルトは空配列）。
   * @param totalLearningTime 合計学習時間（秒単位）。
   * @returns 作成されたログのDocumentReferenceを含むPromise。
   */
  async createDailyLog(userId: string, date: TimeTypes = new Date(), learningSessions: LearningSession[] = [], totalLearningTime: number = 0): Promise<DocumentReference<UserDailyLogData>> {
    const midnightDate = getMidnightTimestamp(date);
    return this.executeWithDBInstance(userId, async (userDailyLogsDB) => {
      return await userDailyLogsDB.createUserDailyLogs(userId, midnightDate, learningSessions, totalLearningTime);
    }, "creating daily log");
  }

  /**
   * 指定された日付の日次ログを取得します。
   * @param userId ユーザーID。
   * @param dateTime ログの日付（デフォルトは現在の日付）。
   * @returns 指定された日付のUserDailyLogDataを含むPromise。見つからなかった場合はnull。
   */
  async getDailyLog(userId: string, dateTime: TimeTypes = new Date()): Promise<UserDailyLogData | null> {
    const date = getMidnightTimestamp(dateTime);
    return this.executeWithDBInstance(userId, async (userDailyLogsDB) => {
      return await userDailyLogsDB.getUserDailyLogsByDate(date);
    }, "getting daily log");
  }

  /**
   * 学習セッションデータを追加します。
   * @param userId ユーザーID。
   * @param spaceId 学習スペースID。
   * @param learningTime 学習時間（秒単位）。
   * @param startTime 学習開始時間。
   * @param endTime 学習終了時間（デフォルトは現在のタイムスタンプ）。
   */
  async addSessionData(userId: string, spaceId: string, learningTime: number, startTime: TimeTypes, endTime: TimeTypes = Timestamp.now()) {
    const session: LearningSession = {
      spaceId,
      startTime: toTimestamp(startTime),
      endTime: toTimestamp(endTime),
      learningTime,
    };

    const todayMidnight = getMidnightTimestamp();
    await this.executeWithDBInstance(userId, async (userDailyLogsDB) => {
      const logData = await userDailyLogsDB.getUserDailyLogsByDate(todayMidnight);
      if (logData) {
        await userDailyLogsDB.updateUserDailyLogs(logData.docId, {
          learningSessions: [...logData.learningSessions, session],
          totalLearningTime: Number(logData.totalLearningTime) + Number(learningTime),
        });
      } else {
        await this.createDailyLog(userId, todayMidnight, [session], learningTime);
      }
    }, "adding session data");
  }

  /**
   * 週ごとの日次ログを取得します。
   * @param userId ユーザーID。
   * @param targetDate 対象の日付（デフォルトは現在の日付）。
   * @returns 週ごとのUserDailyLogDataの配列を含むPromise。
   */
  async getWeeklyLogs(userId: string, targetDate: TimeTypes = new Date()): Promise<UserDailyLogData[]> {
    const week = startOfWeek(toDate(targetDate));
    return this.executeWithDBInstance(userId, async (userDailyLogsDB) => {
      return await userDailyLogsDB.getLatestLogs(week);
    }, "getting weekly logs");
  }

  /**
   * 指定された日数前からの最新のログを取得します。
   * @param userId ユーザーID。
   * @param daysAgo 日数前。
   * @param fromStartOfWeek 週の開始日からの取得を行うか（デフォルトはfalse）。
   * @param baseDate 基準日（デフォルトは現在の日付）。
   * @returns 指定された日数前からのUserDailyLogDataの配列を含むPromise。
   */
  async getLatestLogsByDaysAgo(userId: string, daysAgo: number, fromStartOfWeek: boolean = false, baseDate: TimeTypes = new Date()): Promise<UserDailyLogData[]> {
    const millisDiff = convertToMilliseconds(baseDate) - daysAgo * DAYS_IN_MILLISECOND;
    const diff: TimeTypes = fromStartOfWeek ? startOfWeek(toDate(millisDiff)) : millisDiff;
    
    return this.executeWithDBInstance(userId, async (userDailyLogsDB) => {
      const logs = await userDailyLogsDB.getLatestLogs(diff);
      if (!logs) {
        console.error('No logs found');
        return [];
      }
      return logs;
    }, "getting latest logs by days ago");
  }
  
  /**
   * 日次ログの配列から学習時間のマップを取得します。
   * @param logs UserDailyLogDataの配列。
   * @returns ISODateをキー、学習時間を値とするマップ。
   */
  getLearningTimeMapByLogs(logs: UserDailyLogData[]): Record<ISODate, number> {
    if (!logs) {
      console.error('Logs are undefined');
      return {};
    }
    
    return logs.reduce((acc, log) => {
      const isoDate = toISODate(log.date);
      acc[isoDate] = (acc[isoDate] || 0) + log.totalLearningTime;
      return acc;
    }, {} as Record<ISODate, number>);
  }  

  /**
   * 日次ログの配列から総学習時間を計算します。
   * @param logs UserDailyLogDataの配列。
   * @returns 総学習時間。
   */
  getTotalLearningTimeByLogs(logs: UserDailyLogData[]): number {
    if (!logs) {
      console.error('Logs are undefined');
      return 0;
    }
    return logs.reduce((sum, log) => sum + log.totalLearningTime, 0);
  }

  /**
   * 平均学習時間を計算します。
   * @param logs UserDailyLogDataの配列。
   * @param denoType 平均の分母を決定するタイプ（デフォルトは"dateDiff"）。
   * @returns 平均学習時間。
   */
  getAvgLearningTime(logs: UserDailyLogData[], denoType: number | "length" | "dateDiff" = "dateDiff"): number {
    if (logs.length === 0) return 0;

    const total = this.getTotalLearningTimeByLogs(logs);
    let deno: number;

    if (typeof denoType === "number") {
      deno = denoType >= 1 ? denoType : 1;
    } else if (denoType === "length") {
      deno = logs.length;
    } else {
      const { min, max } = getMinAndMaxFromObjectArray(logs, "date");
      const diff = convertToMilliseconds(max as Timestamp) - convertToMilliseconds(min as Timestamp);
      deno = Math.floor(diff / DAYS_IN_MILLISECOND);
    }

    return deno === 0 ? logs[0].totalLearningTime : total / deno;
  }

  // 週ごとの学習時間合計を取得するメソッド
  async getWeeklyTotalLearningTime(userId: string): Promise<number> {
    const logs = await this.getWeeklyLogs(userId);
    return this.getTotalLearningTimeByLogs(logs);
  }

  // 指定した日数の平均学習時間を取得するメソッド
  async getRecentDaysAvg(userId: string, days: number = 30): Promise<number> {
    const logs = await this.getLatestLogsByDaysAgo(userId, days);
    return this.getAvgLearningTime(logs, days);
  }

  /**
   * 指定されたDB操作をエラーハンドリングと共に実行します。
   * @param userId ユーザーID。
   * @param operation 実行する操作。
   * @param operationName 操作の名前（エラーメッセージ用）。
   * @returns 操作の結果を含むPromise。
   */
  private async executeWithDBInstance<T>(
    userId: string,
    operation: (userDailyLogsDB: UserDailyLogsDB) => Promise<T>,
    operationName: string
  ): Promise<T> {
    try {
      const userDailyLogsDB = this.getUserDailyLogsDBInstance(userId);
      return await operation(userDailyLogsDB);
    } catch (error) {
      console.error(`Error ${operationName}:`, error);
      throw new Error(`Failed to ${operationName}`);
    }
  }
}
