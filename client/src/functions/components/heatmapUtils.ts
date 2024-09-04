import { BGColorClass } from "../../types/module/tailwindTypes";
import { HeatmapCellColor } from "../../types/util/componentsTypes";
import { ISODate } from "../../types/util/dateTimeTypes";

/**
 * @param borderCount - 対応する色を取得するための数値
 * @param heatmapColors - HeatmapCellColorの配列
 * @returns - 対応するBGColorClassまたはundefined
 */
export const getColorClassForCount = (borderCount: number, heatmapColors: HeatmapCellColor[]): BGColorClass | undefined => {
  return heatmapColors
      .filter(color => color.borderCount === borderCount)
      .map(color => color.colorClass)
      .shift(); // 最初に一致した色を返す
}

export const mapDateToColor = (
  dateValues: Record<ISODate, number>,
  heatmapColors: HeatmapCellColor[]
): Record<ISODate, BGColorClass> => {
  // 日付ごとの色を格納するためのオブジェクト
  const dateToColorMap: Record<ISODate, BGColorClass> = {};

  // 各日付に対して色を取得
  for (const [date, count] of Object.entries(dateValues)) {
      const colorClass = getColorClassForCount(count, heatmapColors);
      if (colorClass) {
          dateToColorMap[date as ISODate] = colorClass;
      }
  }

  return dateToColorMap;
}
