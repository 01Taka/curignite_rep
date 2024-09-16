import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../../base";
import { UserLearningGoalData, Session } from "../../../../../types/firebase/db/user/userStructure";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { Subject } from "../../../../../types/firebase/db/common/commonTypes";
import { LearningGoalStatus } from "../../../../../types/firebase/db/user/userSupplementTypes";
import { TimeTypes } from "../../../../../types/util/dateTimeTypes";
import { toTimestamp } from "../../../../../functions/dateTimeUtils";

export class UserLearningGoalService {
  constructor(private firestore: Firestore) {}

  createBaseDB(userId: string): BaseDB<UserLearningGoalData> {
    return new BaseDB(this.firestore, `users/${userId}/learningGoals`);
  }

  async createGoal(
    userId: string,
    objective: string,
    subject: Subject,
    targetDuration: number,
    status: LearningGoalStatus
  ): Promise<DocumentReference<UserLearningGoalData, DocumentData>> {
    const data: UserLearningGoalData = {
      ...getInitialBaseDocumentData(userId),
      objective,
      subject,
      targetDuration,
      status,
      sessions: [],
      durationSpent: null,
    };

    try {
      const baseDB = this.createBaseDB(userId);
      return await baseDB.create(data);
    } catch (error) {
      console.error('Error creating learning goal:', error);
      throw error;
    }
  }

  async getSessions(userId: string, goalId: string): Promise<Session[]> {
    try {
      const baseDB = this.createBaseDB(userId);
      const goal = await baseDB.read(goalId);
      return goal?.sessions || [];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  async addSessionToGoal(userId: string, goalId: string, startTime: TimeTypes, endTime: TimeTypes): Promise<void> {
    try {
      const sessions = await this.getSessions(userId, goalId);
      const newSession = {
        startTime: toTimestamp(startTime),
        endTime: toTimestamp(endTime),
      } as Session;

      const baseDB = this.createBaseDB(userId);
      await baseDB.update(goalId, { sessions: [...sessions, newSession] });
    } catch (error) {
      console.error('Error adding session to goal:', error);
      throw error;
    }
  }

  async getGoal(userId: string, goalId: string): Promise<UserLearningGoalData | null> {
    try {
      const baseDB = this.createBaseDB(userId);
      return await baseDB.read(goalId);
    } catch (error) {
      console.error('Error fetching learning goal:', error);
      throw error;
    }
  }

  async updateGoalStatus(userId: string, goalId: string, status: LearningGoalStatus) {
    try {
      const baseDB = this.createBaseDB(userId);
      await baseDB.update(goalId, { status })
    } catch (error) {
      console.error('Error updating learning goal:', error);
      throw error;
    }
  }

  async setGoalDurationSpent(userId: string, goalId: string, setTimeMs: number) {
    try {
      const baseDB = this.createBaseDB(userId);
      await baseDB.update(goalId, { durationSpent: setTimeMs });
    } catch (error) {
      console.error('Error updating learning goal:', error);
      throw error;
    }
  }
}
