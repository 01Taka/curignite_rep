import { Timestamp } from "firebase/firestore";
import { DayOfWeek } from "../../../../constants/utils/dateTimeConstants";
import { Range } from "../../../util/componentsTypes";
import { ActionAtExpired } from "./taskStep/taskStepSupplementTypes";

export type TaskPriority = "high" | "medium" | "low";

export interface CategoryActivity {
  categoryId: string; // カテゴリのID
  problemIdsRange: Range[]; // カテゴリ内の問題番号
}

export type ProblemSetActivityManagementMethod = 'page' | 'mainQuestion';

export interface AutoStepSetting {
  tacklePlan: Record<DayOfWeek, Record<string, number>>; // { week, { categoryId, quantity } }
  skipDates: Timestamp[];
  actionAtExpired: ActionAtExpired;
}