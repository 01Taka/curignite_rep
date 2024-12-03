import { DocumentReference, DocumentData } from "firebase/firestore";
import { useCallback } from "react";
import serviceFactory from "../../../../../../../firebase/db/factory";
import { IndividualTaskWrite } from "../../../../../../../types/firebase/db/task/taskStructure";
import useEffectOnCondition from "../../../../../../hooks/common/useEffectOnCondition";
import useAsyncHandler from "../../../../../../hooks/form/useAsyncHandler";
import { CreateIndividualTaskFormState } from "../../../types/createTask/createIndividualTaskTypes";
import { MINUTES_IN_MILLISECOND } from "../../../../../../../constants/utils/dateTimeConstants";

const useCreateIndividualTaskHandler = (
  formState: CreateIndividualTaskFormState,
  userId: string | null,
  onSuccessCreate: () => void,
  onFailedMessage?: string
) => {
  const { asyncStatus, callAsyncFunction, logError, reset } = useAsyncHandler<DocumentReference<IndividualTaskWrite, DocumentData>>();

  useEffectOnCondition(asyncStatus === "success", { onSuccess: [onSuccessCreate, reset] });

  const handleCreateIndividualTask = useCallback(async () => {
    if (!userId) {
      logError("User is not authenticated.", "ユーザーが認証されていません。ログインしてください。");
      return;
    }
    const individualTaskService = serviceFactory.createIndividualTaskService();
      callAsyncFunction(individualTaskService.createTask.bind(individualTaskService),[
        userId,
        formState.title,
        formState.dueDateTime,
        formState.taskNote,
        formState.estimatedDuration * MINUTES_IN_MILLISECOND
      ], onFailedMessage)
  }, [userId, formState, onFailedMessage, callAsyncFunction, logError]);

  return { asyncStatus, handleCreateIndividualTask };
}

export default useCreateIndividualTaskHandler;
