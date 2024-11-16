// import { Timestamp } from "firebase/firestore";
// import { UserData, UserRead, UserWrite } from "../../../../types/firebase/db/user/userStructure";
// import BaseDB from "../../handler/firestoreService";
// import { validateNumber } from "../../../../functions/utils/formUtils";
// import { convertToDate } from "../../../../functions/utils/dateTimeUtils";
// import { differenceInDays } from "date-fns";
// import { UserService } from "./userService";
// import FirestoreService from "../../handler/firestoreService";

// export class UserStateManager {
//   private fss: FirestoreService<UserRead, UserWrite>;

//   constructor(
//     private userService: UserService,
//   ) {
//     this.fss = userService.firestoreService;
//   }

  
//   async addTotalLearningTime(userId: string, addingTimeMs: number) {
//     try {
//       const user = await this.fss.read(userId);
//       if (!user) return;
//       const total = validateNumber(addingTimeMs) + validateNumber(user.totalLearningTime);
//       await this.fss.update(userId, { totalLearningTime: total });
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }

//   async updateConsecutiveLearningNumber(userId: string) {
//     try {
//       const user = await this.fss.read(userId);
//       if (!user) return;
  
//       const now = Timestamp.now();
//       const lastLearningDate = convertToDate(user.state.lastLearningTimestamp);

//       const diffInDays = differenceInDays(new Date(), lastLearningDate);
  
//       if (diffInDays === 0) {
//         await this.updateLastLearningTimestamp(userId, now);
//       } else if (this.isConsecutiveLearning(diffInDays)) {
//         await this.incrementConsecutiveLearning(userId, user, now);
//       } else {
//         await this.resetConsecutiveLearning(userId, now);
//       }
//     } catch (error) {
//       console.error('Error updating consecutive learning number:', error);
//     }
//   }
  
//   private async updateLastLearningTimestamp(userId: string, timestamp: Timestamp) {
//     await this.fss.update(userId, { lastLearningTimestamp: timestamp });
//   }
  
//   private isConsecutiveLearning(diffInDays: number): boolean {
//     return diffInDays <= 2;
//   }
  
//   private async incrementConsecutiveLearning(userId: string, user: UserData, timestamp: Timestamp) {
//     const newConsecutiveNumber = validateNumber(user.consecutiveLearningNumber) + 1;
//     const maxConsecutiveLearningNumber = Math.max(newConsecutiveNumber, validateNumber(user.maxConsecutiveLearningNumber));

//     await this.fss.update(userId, {
//       lastLearningTimestamp: timestamp,
//       consecutiveLearningNumber: newConsecutiveNumber,
//       maxConsecutiveLearningNumber: maxConsecutiveLearningNumber,
//     });
//   }

//   private async resetConsecutiveLearning(userId: string, timestamp: Timestamp) {
//     await this.fss.update(userId, {
//       lastLearningTimestamp: timestamp,
//       consecutiveLearningNumber: 1,
//     });
//   }  

  
//   /**
//    * 自分が作成したスペースIDのリストに新しくIDを追加します。
//    */
//   async appendSpaceId(userId: string, spaceId: string): Promise<void> {
//     await this.updateSpaceIdList(userId, spaceIds => {
//       if (!spaceIds.includes(spaceId)) {
//         return [...spaceIds, spaceId];
//       }
//       return spaceIds;
//     });
//   }

//   /**
//    * 自分が作成したスペースIDのリストからIDを削除します。
//    */
//   async removeSpaceId(userId: string, spaceId: string): Promise<void> {
//     await this.updateSpaceIdList(userId, spaceIds => spaceIds.filter(id => id !== spaceId));
//   }

//   private async updateSpaceIdList(userId: string, updateFn: (spaceIds: string[]) => string[]): Promise<void> {
//     try {
//       const user = await this.userService.getUser(userId);
//       const updatedSpaceIds = updateFn(user.relatedResources.spaceIds || []);
//       await this.fss.update(userId, { "relatedResources.spaceIds": updatedSpaceIds });
//     } catch (error) {
//       this.handleError(`Failed to update space IDs for user ${userId}.`, error);
//     }
//   }

//   /**
//  * ユーザーのタスクリストIDを取得します。
//  */
//   async getTaskListId(userId: string): Promise<string> {
//     try {
//       const user = await this.userService.getUser(userId);
//       return user.relatedResources.taskListId;
//     } catch (error) {
//       this.handleError(`Failed to retrieve task list ID for userId ${userId}.`, error);
//     }
//   }

//   async setCurrentTargetLearningGoalId(userId: string, goalId: string | null): Promise<void> {
//     try {
//       await this.fss.update(userId, { currentTargetLearningGoalId: goalId});
//     } catch (error) {
//       this.handleError(`Failed to update currentTargetLearningGoalId ${userId}`, error);
//     }
//   }

//   private handleError(message: string, error: unknown): never {
//     console.error(message, error);
//     throw new Error(message);
//   }
// }

export {}