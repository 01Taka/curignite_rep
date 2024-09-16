import { IndexedDBCurrentLearningGoal } from "../../../../types/browserStorage/indexedDB/learningGoalTypes";
import { validateNumber } from "../../../utils";
import { IndexedDBHandler } from "../indexedDBHandler";

export class IndexedLearningGoalService {
  private static readonly DB_NAME = "learningGoal";
  private static readonly VERSION = 6;
  private static readonly TIMEOUT = 5000;

  private static indexedDB = new IndexedDBHandler(
    IndexedLearningGoalService.DB_NAME,
    ["currentGoal"],
    IndexedLearningGoalService.VERSION,
    IndexedLearningGoalService.TIMEOUT
  );

  private static currentGoalDB = this.indexedDB.getStoreHandler<IndexedDBCurrentLearningGoal>("currentGoal");

  /**
   * Retrieves the current learning goal for the given user.
   * @param userId - The user ID.
   * @returns The current learning goal or null if not found.
   */
  static async getCurrentGoal(userId: string): Promise<IndexedDBCurrentLearningGoal | null> {
    try {
      return this.currentGoalDB.getData(userId, 0);
    } catch (error) {
      console.error("Failed to get current goal:", error);
      return null;
    }
  }

  /**
   * Creates a new current learning goal for the given user.
   * @param userId - The user ID.
   * @param learningGoalId - The learning goal ID.
   * @param durationSpent - The time spent on this goal (in milliseconds).
   * @returns The key of the newly created goal.
   */
  static async createCurrentGoal(
    userId: string,
    learningGoalId: string,
    durationSpent: number = 0,
    allowedOverflowTime: number = 0
  ): Promise<IDBValidKey> {
    try {
      return this.currentGoalDB.putData({ id: 0, uid: userId, learningGoalId, durationSpent, allowedOverflowTime });
    } catch (error) {
      console.error("Failed to create current goal:", error);
      throw error;
    }
  }

  static async clearCurrentGoal(userId: string): Promise<void> {
    await this.currentGoalDB.deleteData(userId, 0);
  }

  /**
   * Set the specified duration to the current goal's durationSpent.
   * @param userId - The user ID.
   * @param setTimeMs - The time to set (in milliseconds).
   */
  static async setDurationSpent(userId: string, setTimeMs: number): Promise<void> {
    try {
      const updatedDuration = validateNumber(setTimeMs);
      await this.currentGoalDB.updateData(userId, 0, { durationSpent: updatedDuration });
    } catch (error) {
      console.error("Failed to add duration spent:", error);
    }
  }

  /**
   * Gets the duration spent on the current learning goal.
   * @param userId - The user ID.
   * @returns The duration spent (in milliseconds) or 0 if no goal exists.
   */
  static async getDurationSpent(userId: string): Promise<number | null> {
    try {
      const currentGoal = await this.getCurrentGoal(userId);
      return currentGoal?.durationSpent ?? null;
    } catch (error) {
      console.error("Failed to get duration spent:", error);
      return 0;
    }
  }

  static async setAllowedOverflowTime(userId: string, setTimeMs: number): Promise<void> {
    try {
      const updatedTime = validateNumber(setTimeMs);
      await this.currentGoalDB.updateData(userId, 0, { allowedOverflowTime: updatedTime });
    } catch (error) {
      console.error("Failed to add duration spent:", error);
    }
  }

  static async getAllowedOverflowTime(userId: string): Promise<number> {
    try {
      const currentGoal = await this.getCurrentGoal(userId);
      return currentGoal?.allowedOverflowTime || 0;
    } catch (error) {
      console.error("Failed to get duration spent:", error);
      return 0;
    }
  }
}
