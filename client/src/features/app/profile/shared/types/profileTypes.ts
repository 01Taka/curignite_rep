export interface UserProfile {
  username: string;
  iconUrl: string;
  level: number;
  levelProgress: number; // 現在のレベル進捗 0~1
}

export interface UserStudyProfile {
  totalStudyTimeMs: number; // 合計学習時間 (ミリ秒)
  maxConsecutiveStudyDays: number; // 最大連続学習日数
  averageStudyTimeMs: number; // 平均学習時間 (ミリ秒)
  studyTimeThisWeekMs: number; // 今週の学習時間 (ミリ秒)
  averageStudyTimeThisWeekMs: number; // 今週の平均学習時間 (ミリ秒)
  consecutiveStudyDaysCurrentStreak: number; // 現在の連続学習日数
  recentStudyTimesMs: number[]; // 最近の学習時間 (ミリ秒) [インデックス0が今日のデータ]
}

