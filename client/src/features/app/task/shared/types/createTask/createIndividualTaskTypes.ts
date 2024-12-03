export interface CreateIndividualTaskFormState {
  title: string;
  dueDateTime: Date | null;
  taskNote: string;
  estimatedDuration: number;
}