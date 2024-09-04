import { HeatmapCellColor } from "../../types/util/componentsTypes";
import { MINUTES_IN_MILLISECOND } from "../utils/dateTimeConstants";

// 時間に応じた色のフェーズ設定
export const HEATMAP_BY_LEARNING_TIME: HeatmapCellColor[] = [
  { borderCount: 300 * MINUTES_IN_MILLISECOND, colorClass: "bg-red-800" },   // 300分以上: 赤色
  { borderCount: 240 * MINUTES_IN_MILLISECOND, colorClass: "bg-pink-500" },  // 240分以上: ピンク色
  { borderCount: 180 * MINUTES_IN_MILLISECOND, colorClass: "bg-blue-500" },  // 180分以上: 青色
  { borderCount: 120 * MINUTES_IN_MILLISECOND, colorClass: "bg-blue-300" },  // 120分以上: 淡い青色
  { borderCount: 60 * MINUTES_IN_MILLISECOND, colorClass: "bg-green-500" },  // 60分以上: 緑色
  { borderCount: 1 * MINUTES_IN_MILLISECOND, colorClass: "bg-green-200" },   // 1分以上: 淡い緑色
  { borderCount: 0, colorClass: "bg-gray-50" },                            // 0分: 白色
];