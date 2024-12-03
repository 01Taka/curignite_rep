import { DocumentReference, DocumentData } from "firebase/firestore";
import { useCallback } from "react";
import serviceFactory from "../../../../../../../firebase/db/factory";
import { mergeRanges } from "../../../../../../../functions/utils/rangeUtils";
import { ProblemSetActivityWrite } from "../../../../../../../types/firebase/db/task/taskStructure";
import { CategoryActivity } from "../../../../../../../types/firebase/db/task/taskSupplementTypes";
import useAsyncHandler from "../../../../../../hooks/form/useAsyncHandler";
import { CreateActivityFormState } from "../../../types/createTask/createActivityTypes";
import useEffectOnCondition from "../../../../../../hooks/common/useEffectOnCondition";

const useCreateActivityHandler = (
  formState: CreateActivityFormState,
  userId: string | null,
  problemSetId: string,
  onSuccessCreate: () => void,
  onFailedMessage?: string
) => {
  const { asyncStatus, callAsyncFunction, logError, reset } = useAsyncHandler<DocumentReference<ProblemSetActivityWrite, DocumentData>>();

  useEffectOnCondition(asyncStatus === "success", { onSuccess: [onSuccessCreate, reset] });

  const handleCreateActivity = useCallback(async () => {
    if (!userId) {
      logError("User is not authenticated.", "ユーザーが認証されていません。ログインしてください。");
      return;
    }
    const activityService = serviceFactory.createProblemSetActivityService();
      const categoryActivities: CategoryActivity[] = formState.categoryActivities.map(activity => ({
        categoryId: activity.categoryId,
        problemIdsRange: mergeRanges(activity.problemRanges)
      }))
      callAsyncFunction(
      activityService.createActivity.bind(activityService),
      [
        userId,
        problemSetId,
        formState.dueDateTime,
        categoryActivities
      ], 
      onFailedMessage
    );
  }, [userId, problemSetId, formState, onFailedMessage, callAsyncFunction, logError]);

  return { asyncStatus, handleCreateActivity }
}

export default useCreateActivityHandler;