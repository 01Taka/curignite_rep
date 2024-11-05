import { DateRange, Range } from "../../../../../types/util/componentsTypes";

export interface ProblemGroup {
  id: string;
  categoryName: string;
  problemNumbers: number[];
}

export interface ProblemWithKey {
  key: string;
  problemId: number;
}

export interface ProblemsWithDate {
  date: Date;
  problems: ProblemWithKey[];
}

export interface EntryProblems {
  categoryId: string;
  problemRanges: Range[];
}

export interface PlanEntry {
  dateRanges: DateRange[];
  problems: EntryProblems[];
}

export interface ProblemContainerRef {
  onCancelSelection: () => void;
  deleteAllSelection: () => void;
}

export interface SelectDateCalendarRef {
  onCancelSelection: () => void;
  deleteAllSelection: () => void;
}
