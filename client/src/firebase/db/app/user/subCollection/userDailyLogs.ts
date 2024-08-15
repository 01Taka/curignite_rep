import { DocumentReference, Firestore, Timestamp, where } from "firebase/firestore";
import BaseDB from "../../../base";
import { LearningSession, UserDailyLogData } from "../../../../../types/firebase/db/user/userDailyLogsTypes";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { TimeTypes } from "../../../../../types/util/dateTimeTypes";
import { getMidnightTimestamp } from "../../../../../functions/dateTimeUtils";

class UserDailyLogsDB extends BaseDB<UserDailyLogData> {
  constructor(firestore: Firestore, userId: string) {
    super(firestore, `users/${userId}/dailyLogs`);
  }

  /**
   * 新しいユーザーの日次ログドキュメントをFirestoreに作成します。
   * @param createdById ログを作成したユーザーのID。
   * @param date ログの日付を示すタイムスタンプ。
   * @param learningSessions ログに含める学習セッションの配列。
   * @param totalLearningTime 合計学習時間（秒単位）。
   * @returns 新しく作成されたログのDocumentReferenceを含むPromise。
   */
  async createUserDailyLogs(
    createdById: string,
    date: Timestamp,
    learningSessions: LearningSession[] = [],
    totalLearningTime: number = 0,
  ): Promise<DocumentReference<UserDailyLogData>> {
    const data: UserDailyLogData = {
      ...getInitialBaseDocumentData(createdById),
      date,
      learningSessions,
      totalLearningTime,
    };
    return this.handleOperation(() => this.create(data), "creating user daily logs");
  }

  /**
   * 特定のIDを持つユーザーの日次ログを取得します。
   * @param logId 取得するログのID。
   * @returns UserDailyLogDataを含むPromise。見つからなかった場合はnull。
   */
  async getUserDailyLogs(logId: string): Promise<UserDailyLogData | null> {
    return this.handleOperation(() => this.read(logId), "getting user daily logs");
  }

  /**
   * 指定された境界日以降のすべてのユーザーの日次ログを取得します。
   * @param borderDate 取得を開始する日付。
   * @returns UserDailyLogDataの配列を含むPromise。
   */
  async getLatestLogs(borderDate: TimeTypes): Promise<UserDailyLogData[]> {
    const borderTimestamp = getMidnightTimestamp(borderDate);
    return this.handleOperation(() => this.getAll(where("date", ">=", borderTimestamp)), "getting latest user daily logs");
  }

  /**
   * 現在のユーザーのすべての日次ログを取得します。
   * @returns UserDailyLogDataの配列を含むPromise。
   */
  async getAllUserDailyLogs(): Promise<UserDailyLogData[]> {
    return this.handleOperation(() => this.getAll(), "getting all user daily logs");
  }

  /**
   * 指定された日付に一致する最初のユーザーの日次ログを取得します。
   * @param timestamp 検索する日付のタイムスタンプ。
   * @returns UserDailyLogDataを含むPromise。見つからなかった場合はnull。
   */
  async getUserDailyLogsByDate(timestamp: Timestamp): Promise<UserDailyLogData | null> {
    return this.handleOperation(() => this.getFirstMatch("date", timestamp), "getting user daily logs by date");
  }

  /**
   * 特定のIDを持つユーザーの日次ログを更新します。
   * @param logId 更新するログのID。
   * @param data ログを更新するための部分的なデータ。
   * @returns ログが更新されたら完了するPromise。
   */
  async updateUserDailyLogs(logId: string, data: Partial<UserDailyLogData>): Promise<void> {
    await this.handleOperation(() => this.update(logId, data), "updating user daily logs");
  }

  /**
   * Firestore操作を一貫したエラーログと共に処理するためのヘルパーメソッド。
   * @param operation 実行する操作。
   * @param operationName 操作の名前（エラーメッセージ用）。
   * @returns 操作の結果を含むPromise。
   */
  private async handleOperation<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(`Error ${operationName}:`, error);
      throw new Error(`Failed to ${operationName}`);
    }
  }
}

export default UserDailyLogsDB;
