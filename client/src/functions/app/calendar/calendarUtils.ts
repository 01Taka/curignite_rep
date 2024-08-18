import serviceFactory from "../../../firebase/db/factory";
import { HeatmapCellColor } from "../../../types/util/componentsTypes";
import { ISODate } from "../../../types/util/dateTimeTypes";
import { BGColorClass } from "../../../types/module/tailwindTypes";
import { HEATMAP_BY_LEARNING_TIME } from "../../../types/app/calendarTypes";

// 学習時間に応じた色を取得する関数
export const getHeatmapCellColor = (count: number, heatmap: HeatmapCellColor[]): BGColorClass => {
  const colorClass =  (
    heatmap.find((cell) => cell.borderCount <= count)?.colorClass ||
    heatmap[heatmap.length - 1].colorClass
  );
  console.log(colorClass);
  
  return colorClass;
};

// データベースから取得した学習時間に基づき、カレンダーの日付に色分けを適用する関数
export const getLearningTimeHeatmapFromDB = async (userId: string, daysAgo: number = 21): Promise<Record<ISODate, BGColorClass>> => {
  try {
    const logService = serviceFactory.createUserDailyLogService();
    const logs = await logService.getLatestLogsByDaysAgo(userId, daysAgo, true);
    if (!logs) {
      console.error('No logs found');
      return {};
    }
    const timeMap = logService.getLearningTimeMapByLogs(logs);
    const heatmap: Record<ISODate, BGColorClass> = {};
    for (let key of Object.keys(timeMap)) {
      heatmap[key as ISODate] = getHeatmapCellColor(timeMap[key as ISODate], HEATMAP_BY_LEARNING_TIME)
    }

    return heatmap;
  } catch (error) {
    console.error('DBからの学習時間の色分け取得に失敗しました:', error);
    throw error;
  }
};

