import { DocumentReference, DocumentData } from "firebase/firestore";
import { useCallback } from "react";
import serviceFactory from "../../../../../../../firebase/db/factory";
import { mergeRanges } from "../../../../../../../functions/utils/rangeUtils";
import { useAppSelector } from "../../../../../../../redux/hooks";
import { ProblemSetActivityWrite } from "../../../../../../../types/firebase/db/task/taskStructure";
import { CategoryActivity } from "../../../../../../../types/firebase/db/task/taskSupplementTypes";
import useAsyncHandler from "../../../../../../hooks/form/useAsyncHandler";
import useFormState from "../../../../../../hooks/form/useFormState";
import { CreateActivityFormState } from "../../../types/createTask/createActivityTypes";

const useCreateActivityHandler = (problemSetId: string, onFailedMessage?: string) => {
  const { uid } = useAppSelector(state => state.userSlice);

  const formStateValues = useFormState<CreateActivityFormState>({
    dueDateTime: null,
    categoryActivities: []
  });
  const { formState } = formStateValues;
  const { asyncStatus, callAsyncFunction, setErrorMessage } = useAsyncHandler<DocumentReference<ProblemSetActivityWrite, DocumentData>>();

  const handleCreateActivity = useCallback(async () => {
    if (!uid) {
      console.error('User is not authenticated.');
      setErrorMessage("ユーザーが認証されていません。ログインしてください。");
      return;
    }
    const activityService = serviceFactory.createProblemSetActivityService();
      const categoryActivities: CategoryActivity[] = formState.categoryActivities.map(activity => ({
        categoryId: activity.categoryId,
        problemIdsRange: mergeRanges(activity.problemRanges)
      }))
      callAsyncFunction([
        uid,
        problemSetId,
        formState.dueDateTime,
        categoryActivities
      ], activityService.createActivity.bind(activityService),
      onFailedMessage
    );
  }, [uid, problemSetId, formState, onFailedMessage, callAsyncFunction]);

  return { ...formStateValues, asyncStatus, handleCreateActivity}
}

export default useCreateActivityHandler;