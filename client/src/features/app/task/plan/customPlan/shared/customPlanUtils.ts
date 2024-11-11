import { TimeTypes } from "../../../../../../types/util/dateTimeTypes";
import { convertToDate } from "../../../../../../functions/utils/dateTimeUtils";
import { format } from "date-fns";
import { MINUTES_IN_MILLISECOND } from "../../../../../../constants/utils/dateTimeConstants";

export const formatDueDateTime = (dueDateTime: TimeTypes | null) => {
  return dueDateTime 
  ? format(convertToDate(dueDateTime), 'MM/dd') 
  : null;
}

export const getId = (taskId: string, categoryId: string) => `${taskId}/${categoryId}`;

export const recoveryId = (id: string) => {
  const match = id.match(/^([^/]+)\/([^/]+)$/);
  return match ? { taskId: match[1], categoryId: match[2] } : { taskId: '', categoryId: '' };
};

export const millToMin = (mill: number) => Math.ceil(mill / MINUTES_IN_MILLISECOND);
