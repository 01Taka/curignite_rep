import { Timestamp } from "firebase/firestore";
import { CategoryActivity } from "../taskSupplementTypes";
import { DayOfWeek } from "../../../../../constants/utils/dateTimeConstants";

export type TaskStepState = 'inProgress' | 'completed' | 'pending';

export type ActionAtExpired = 
| "nextDay"            // 次の日にすべて引き継ぐ
| "nextWorkDay"        // 次の取り組み日にすべて引き継ぐ
| "spreadRemaining"    // 残りの取り組み日に均等に分配
| "onHold"             // 保留状態にする
| "shiftAndHold"       // 予定をすべてずらして余りを保留状態にする
| "shiftOnce";         // 1回分ずらす


export interface ProblemInfo {
  categoryId: string;
  problemNumber: number;
  // relatedActivityIds: string[];
}

export interface CategoryQuantity {
  categoryId: string;
  quantity: number;
}

export interface RecurringTacklePlan {
  dayOfWeek: DayOfWeek;
  quantity: number;
}

export interface AutoPlanningSettings {
  recurringTacklePlan: RecurringTacklePlan[];
  excludedDates: Timestamp[];
}