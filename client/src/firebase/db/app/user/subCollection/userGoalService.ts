// import { DocumentData, DocumentReference, Firestore, QueryConstraint, QueryFieldFilterConstraint, Timestamp, where } from "firebase/firestore";
// import BaseDB from "../../../base";
// import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
// import { UserGoalData } from "../../../../../types/firebase/db/user/userStructure";
// import { GoalStatus } from "../../../../../types/firebase/db/user/userSupplementTypes";
// import { Subject } from "../../../../../types/firebase/db/common/commonTypes";
// import { toTimestamp } from "../../../../../functions/dateTimeUtils";
// import { endOfDay, startOfDay } from "date-fns";
// import { removeDuplicatesByKey } from "../../../../../functions/objectUtils";

// export class UserGoalService {
//   constructor(private firestore: Firestore) {}

//   createBaseDB(userId: string): BaseDB<UserGoalData> {
//     return new BaseDB(this.firestore, `users/${userId}/goals`);
//   }

//   async createUserGoal(
//     userId: string,
//     objectives: string,
//     subject: Subject,
//     deadline: Timestamp,
//     status: GoalStatus = "inProgress",
//   ): Promise<DocumentReference<UserGoalData, DocumentData>> {
//     const data: UserGoalData = {
//       ...getInitialBaseDocumentData(userId),
//       objectives,
//       subject,
//       deadline,
//       status,
//     };
//     return await this.createBaseDB(userId).create(data);
//   }

//   async isGoalExist(userId: string, goalId: string): Promise<boolean> {
//     const snapshot = await this.createBaseDB(userId).readAsDocumentSnapshot(goalId);
//     return snapshot.exists();
//   }

//   async getGoal(userId: string, goalId: string): Promise<UserGoalData | null> {
//     return await this.createBaseDB(userId).read(goalId);
//   }

//   async getAllUserGoals(userId: string): Promise<UserGoalData[]> {
//     return await this.createBaseDB(userId).getAll();
//   }

//   private getTodayQuery = (fieldPath: string): QueryConstraint => {
//     const start = toTimestamp(startOfDay(new Date()));
//     const end = toTimestamp(endOfDay(new Date()));
//     return where(fieldPath, ">=", start), where(fieldPath, "<=", end);
//   }
  
//   async getAllTodayGoals(userId: string): Promise<UserGoalData[]> {
//     try {
//       const baseDB = this.createBaseDB(userId);
      
//       const [todayCreatedGoals, withinDeadlineGoals] = await Promise.all([
//         baseDB.getAll(this.getTodayQuery("createdAt")),
//         baseDB.getAll(where("deadline", ">=", toTimestamp(new Date())))
//       ]);
  
//       // ゴールの重複を削除
//       return removeDuplicatesByKey([...todayCreatedGoals, ...withinDeadlineGoals], "docId");
//     } catch (error) {
//       console.error("Failed to fetch today's goals:", error);
//       throw error;
//     }
//   }
  

//   async getAllProgressGoals(userId: string): Promise<UserGoalData[]> {
//     const inProgress: GoalStatus = "inProgress";
//     return await this.createBaseDB(userId).getAll(where("status", "==", inProgress));
//   }

//   async updateGoalStatus(userId: string, goalId: string, status: GoalStatus): Promise<void> {
//     await this.createBaseDB(userId).update(goalId, { status });
//   }
// }

export {}