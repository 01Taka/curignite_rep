import { differenceInDays } from "date-fns";
import { modeColorLabels } from "../../constants/labels";

export const getModeColorByDueDateTime =  (
  dueDateTime: number | null,
  emergencyDaysBorder: number,
  noDueDateTimeColor: string = "#ababab"
) => {
  if (!dueDateTime) return noDueDateTimeColor;
  const today = new Date();
  const daysDifference = differenceInDays(dueDateTime, today);
  return daysDifference < emergencyDaysBorder ? modeColorLabels["emergency"] : modeColorLabels["priority"];
}