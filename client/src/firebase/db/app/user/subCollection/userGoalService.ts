import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { UserGoalData } from "../../../../../types/firebase/db/user/userStructure";
import { GoalStatus } from "../../../../../types/firebase/db/user/userSupplementTypes";
import { Subject } from "../../../../../types/firebase/db/common/commonTypes";

export class UserGoalService {
  constructor(private firestore: Firestore) {}

  createBaseDB(userId: string): BaseDB<UserGoalData> {
    return new BaseDB(this.firestore, `users/${userId}/goals`);
  }

  async createUserGoal(
    userId: string,
    objectives: string,
    subject: Subject,
    deadline: Timestamp,
    status: GoalStatus = "notStarted",
  ): Promise<DocumentReference<UserGoalData, DocumentData>> {
    const data: UserGoalData = {
      ...getInitialBaseDocumentData(userId),
      objectives,
      subject,
      deadline,
      status,
    };
    return await this.createBaseDB(userId).create(data);
  }

  async isGoalExist(userId: string, goalId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(userId).readAsDocumentSnapshot(goalId);
    return snapshot.exists();
  }

  async getAllUserGoals(userId: string): Promise<UserGoalData[]> {
    return await this.createBaseDB(userId).getAll();
  }

  async updateGoalStatus(userId: string, goalId: string, status: GoalStatus): Promise<void> {
    await this.createBaseDB(userId).update(goalId, { status });
  }
}