export interface CurrentSession {
  id: 0;
  uid: string;
  startTime: Date;
}

export interface Session {
  id?: string;
  uid: string;
  startTime: Date;
  endTime: Date;
}