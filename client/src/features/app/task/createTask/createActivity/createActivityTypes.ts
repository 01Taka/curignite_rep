import { Range } from "../../../../../types/util/componentsTypes";

export interface CategoryActivityFormState {
  categoryId: string;
  problemRanges: Range[];
}

export interface CreateActivityFormState {
  dueDateTime: Date | null;
  categoryActivities: CategoryActivityFormState[];
}