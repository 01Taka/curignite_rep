import { LearningGoalStatus } from "../../types/firebase/db/user/userSupplementTypes";
import { HexColorCode } from "../../types/util/utilTypes";

export const learningGoalStatusLabels: Record<LearningGoalStatus, string> = {
  inProgress: "進行中",
  achieved: "達成済み",
  paused: "一時停止中",
  procrastinate: "先延ばし中",
  canceled: "キャンセル済み",
};

export const learningGoalStatusColors: Record<LearningGoalStatus, HexColorCode> = {
  inProgress: "#00BFFF", // ディープスカイブルー
  achieved: "#32CD32", // ライムグリーン
  paused: "#FFD700", // ゴールド
  procrastinate: "#FFA500", // オレンジ
  canceled: "#FF6347", // トマト
};
