import { DocumentData, DocumentReference, Firestore, Timestamp, where } from "firebase/firestore";
import BaseDB from "../../../base";
import { UserDailyLearningSummaryData, UserLearningGoalData } from "../../../../../types/firebase/db/user/userStructure";
import { ISODate, TimeTypes } from "../../../../../types/util/dateTimeTypes";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { convertToDate, convertToMilliseconds, getMidnightTimestamp, toISODate } from "../../../../../functions/dateTimeUtils";
import { validateNumber } from "../../../../../functions/utils";
import { getMinAndMaxFromObjectArray } from "../../../../../functions/objectUtils";
import { DAYS_IN_MILLISECOND } from "../../../../../constants/utils/dateTimeConstants";
import { startOfWeek } from "date-fns";

export class UserDailyLearningSummaryService {
  constructor(private firestore: Firestore) {}

  private createBaseDB(userId: string): BaseDB<UserDailyLearningSummaryData> {
    return new BaseDB(this.firestore, `users/${userId}/dailyLearningSummaries`);
  }

  private formatDate(date: TimeTypes): ISODate {
    return toISODate(date);
  }

  private async createNewSummary(userId: string, date: TimeTypes): Promise<DocumentReference<UserDailyLearningSummaryData>> {
    const data: UserDailyLearningSummaryData = {
      ...getInitialBaseDocumentData(userId),
      date: this.formatDate(date),
      totalDurationSpent: 0,
      learningGoalIds: [],
      learningGoalCount: 0,
    };

    return await this.createBaseDB(userId).create(data);
  }

  async ensureSummaryExists(userId: string, date: TimeTypes): Promise<DocumentReference<UserDailyLearningSummaryData> | null> {
    const existingSummary = await this.getSummaryByDate(userId, date);
    return existingSummary ? null : await this.createNewSummary(userId, date);
  }

  async getSummary(userId: string, summaryId: string): Promise<UserDailyLearningSummaryData | null> {
    return await this.createBaseDB(userId).read(summaryId);
  }

  async getSummaryByDate(userId: string, date: TimeTypes): Promise<UserDailyLearningSummaryData | null> {
    const isoDate = this.formatDate(date);
    return await this.createBaseDB(userId).getFirstMatch("date", isoDate);
  }

  async getOrCreateSummaryByDate(userId: string, date: TimeTypes): Promise<UserDailyLearningSummaryData> {
    const summary = await this.getSummaryByDate(userId, date);
    if (summary) return summary;

    const summaryRef = await this.createNewSummary(userId, date);
    const newSummary = await this.getSummary(userId, summaryRef.id);
    
    if (!newSummary) {
      throw new Error("Failed to retrieve the newly created summary.");
    }
    
    return newSummary;
  }

  async addLearningGoalToSummary(userId: string, date: TimeTypes, learningGoal: UserLearningGoalData): Promise<void> {
    const summary = await this.getOrCreateSummaryByDate(userId, date);
    const updatedLearningGoalIds = [...summary.learningGoalIds, learningGoal.docId];
    const updatedTotalDurationSpent = validateNumber(summary.totalDurationSpent + (learningGoal.durationSpent || 0));
    
    await this.createBaseDB(userId).update(summary.docId, {
      learningGoalIds: updatedLearningGoalIds,
      learningGoalCount: validateNumber(summary.learningGoalCount + 1),
      totalDurationSpent: updatedTotalDurationSpent,
    });
  }

  private async fetchSummaries(userId: string, borderDate: TimeTypes): Promise<UserDailyLearningSummaryData[]> {
    const borderTimestamp = getMidnightTimestamp(borderDate);
    return await this.createBaseDB(userId).getAll(where("date", ">=", borderTimestamp));
  }

  async fetchRecentSummaries(userId: string, borderDate: TimeTypes): Promise<UserDailyLearningSummaryData[]> {
    try {
      return await this.fetchSummaries(userId, borderDate);
    } catch (error) {
      this.logError("Failed to fetch recent summaries", error);
      throw error;
    }
  }

  async fetchWeeklySummaries(userId: string, targetDate: TimeTypes = new Date()): Promise<UserDailyLearningSummaryData[]> {
    try {
      const weekStart = startOfWeek(convertToDate(targetDate));
      return await this.fetchSummaries(userId, weekStart);
    } catch (error) {
      this.logError("Failed to fetch weekly summaries", error);
      throw error;
    }
  }

  async fetchRecentSummariesByDaysAgo(userId: string, daysAgo: number, fromStartOfWeek: boolean = false, baseDate: TimeTypes = new Date()): Promise<UserDailyLearningSummaryData[]> {
    try {
      const baseMillis = convertToMilliseconds(baseDate);
      const millisDiff = baseMillis - daysAgo * DAYS_IN_MILLISECOND;
      const borderDate = fromStartOfWeek ? startOfWeek(convertToDate(millisDiff)) : millisDiff;
      return await this.fetchSummaries(userId, borderDate);
    } catch (error) {
      this.logError("Failed to fetch recent summaries by days ago", error);
      throw error;
    }
  }

  static mapLearningTimeByDate(summaries: UserDailyLearningSummaryData[]): Record<ISODate, number> {
    return summaries.reduce((acc, summary) => {
      const isoDate = summary.date as ISODate;
      acc[isoDate] = (acc[isoDate] || 0) + summary.totalDurationSpent;
      return acc;
    }, {} as Record<ISODate, number>);
  }

  static calculateTotalLearningTime(summaries: UserDailyLearningSummaryData[]): number {
    return summaries.reduce((sum, summary) => sum + summary.totalDurationSpent, 0);
  }

  static calculateAverageLearningTime(
    summaries: UserDailyLearningSummaryData[],
    denoType: number | "length" | "dateDiff" = "dateDiff"
  ): number {
    if (summaries.length === 0) return 0;

    const totalLearningTime = this.calculateTotalLearningTime(summaries);
    let denominator: number;

    switch (denoType) {
      case "length":
        denominator = summaries.length;
        break;
      case "dateDiff":
        const { min, max } = getMinAndMaxFromObjectArray(summaries, "date");
        const dateDiff = convertToMilliseconds(max as Timestamp) - convertToMilliseconds(min as Timestamp);
        denominator = Math.floor(dateDiff / DAYS_IN_MILLISECOND);
        break;
      default:
        denominator = denoType >= 1 ? denoType : 1;
    }

    return denominator === 0 ? summaries[0].totalDurationSpent : totalLearningTime / denominator;
  }

  async calculateWeeklyTotalLearningTime(userId: string): Promise<number> {
    try {
      const summaries = await this.fetchWeeklySummaries(userId);
      return UserDailyLearningSummaryService.calculateTotalLearningTime(summaries);
    } catch (error) {
      this.logError("Failed to calculate weekly total learning time", error);
      throw error;
    }
  }

  async calculateRecentDaysAverageLearningTime(userId: string, days: number = 30): Promise<number> {
    try {
      const summaries = await this.fetchRecentSummariesByDaysAgo(userId, days);
      return UserDailyLearningSummaryService.calculateAverageLearningTime(summaries, days);
    } catch (error) {
      this.logError("Failed to calculate recent days average learning time", error);
      throw error;
    }
  }

  private logError(message: string, error: unknown): void {
    console.error(`${message}: ${error}`);
  }
}
