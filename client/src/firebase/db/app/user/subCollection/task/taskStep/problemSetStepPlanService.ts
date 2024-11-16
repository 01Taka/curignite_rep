// import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
// import { ProblemSetStepPlanData } from "../../../../../../../types/firebase/db/task/taskStep/taskStepStructure";
// import BaseDB from "../../../../../handler/firestoreService";
// import { TimeTypes } from "../../../../../../../types/util/dateTimeTypes";
// import { CategoryActivity } from "../../../../../../../types/firebase/db/task/taskSupplementTypes";
// import { getMidnightDate, toTimestamp } from "../../../../../../../functions/utils/dateTimeUtils";
// import { AutoFieldToUndefined } from "../../../../../../../types/firebase/db/formatTypes";
// import { autoFields } from "../../../../../../../constants/firebase/firestoreConstants";
// import { CategoryQuantity } from "../../../../../../../types/firebase/db/task/taskStep/taskStepSupplementTypes";

// export class problemSetStepPlanService {
//   private baseDB: BaseDB<ProblemSetStepPlanData> | undefined;
  
//   constructor(private firestore: Firestore) {}

//   private getBaseDB(userId: string, stepId: string): BaseDB<ProblemSetStepPlanData> {
//     if (!this.baseDB || this.baseDB.getCollectionPath() !== this.getPath(userId, stepId)) {
//       this.baseDB = new BaseDB(this.firestore, this.getPath(userId, stepId));
//     }
//     return this.baseDB;
//   }

//   private getPath(userId: string, stepId: string) {
//     return `users/${userId}/problemSetSteps/${stepId}/plans`;
//   }

//   async addPlan(
//     creatorId: string,
//     stepId: string,
//     date: TimeTypes,
//     mixedQuantityToTackle?: number,
//     quantityToTackle: CategoryQuantity[] = [],
//     tackleProblems: CategoryActivity[] = []
//   ): Promise<DocumentReference<ProblemSetStepPlanData, DocumentData> | null> {
//     const baseDB = this.getBaseDB(creatorId, stepId);
//     const dateMidnight = toTimestamp(getMidnightDate(date));
//     const existData = await baseDB.getFirstMatch('date', dateMidnight);
//     if (existData) {
//       const newQuantityIds = quantityToTackle.map(quantity => quantity.categoryId);
//       const quantities = [
//         ...existData.quantityToTackle.filter(quantity => !newQuantityIds.includes(quantity.categoryId)),
//         ...quantityToTackle
//       ]
//       const tackles =  [...existData.tackleProblems, ...tackleProblems];
//       await baseDB.update(existData.docId, { mixedQuantityToTackle, quantityToTackle: quantities, tackleProblems: tackles });
//       return null;
//     }
//     const data: AutoFieldToUndefined<ProblemSetStepPlanData> = {
//       ...autoFields,
//       createdById: creatorId,
//       date: dateMidnight,
//       mixedQuantityToTackle: mixedQuantityToTackle ?? 0,
//       quantityToTackle: quantityToTackle,
//       tackleProblems: tackleProblems
//     }
//     return await baseDB.create(data);
//   }
// }

export {}