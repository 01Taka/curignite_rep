export interface TaskDataPreview {
  id: string;
  title: string;
  isCompleted: string;
  problemSetField: {
    problemSetId: string;
    problemSetName: string;
    categoryId: string;
    categoryName: string;
  }
}