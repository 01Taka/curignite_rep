import { rangesToString } from "../../../../../../functions/utils/rangeUtils";
import { CategoryActivityStatus } from "../../../../../../types/firebase/db/task/taskExpansionTypes";

export const activityStatusToString = (activityStatuses: CategoryActivityStatus | undefined) => {
  if (!activityStatuses) {
    return {
      name: "",
      ranges: ""
    }
  }
  return {
    name: activityStatuses.categoryName,
    ranges: rangesToString(activityStatuses.problemIdsRange)
  }
}