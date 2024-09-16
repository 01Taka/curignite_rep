export interface CurrentSession {
  id: 0;
  uid: string;
  learningGoalId: string;
  startTime: Date;
}

export interface IndexedDBSession {
  id?: number;
  uid: string;
  learningGoalId: string;
  startTime: Date;
  endTime: Date;
}