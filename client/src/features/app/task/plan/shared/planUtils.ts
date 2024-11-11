import { format } from "date-fns";
import { convertToDate } from "../../../../../functions/utils/dateTimeUtils";
import { TimeTypes } from "../../../../../types/util/dateTimeTypes";
import { MINUTES_IN_MILLISECOND } from "../../../../../constants/utils/dateTimeConstants";

export const millToMin = (mill: number) => Math.ceil(mill / MINUTES_IN_MILLISECOND);

export const formatDueDateTime = (dueDateTime: TimeTypes | null) => {
  return dueDateTime 
  ? format(convertToDate(dueDateTime), 'MM/dd') 
  : null;
}