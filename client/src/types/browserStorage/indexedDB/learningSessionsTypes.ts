export interface CurrentSession {
  id: 0,
  startTime: Date;
}

export interface Session {
  id?: string;
  startTime: Date,
  endTime: Date,
}