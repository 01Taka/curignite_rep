import serviceFactory from "../../../../../../../firebase/db/factory";
import { ProblemSetRead } from "../../../../../../../types/firebase/db/task/taskStructure";
import useEffectOnCondition from "../../../../../../hooks/common/useEffectOnCondition";
import useAsyncHandler from "../../../../../../hooks/form/useAsyncHandler";
import { UpdateProblemSetFormState } from "../../../types/createTask/createProblemSetTypes";

const useUpdateProblemSetHandler = (formState: UpdateProblemSetFormState, userId: string | null, problemSet: ProblemSetRead, onSuccessUpdate: () => void, onFailedMessage?: string) => {
  const { asyncStatus, errorMessage, callAsyncFunction, logError, reset } = useAsyncHandler();

  useEffectOnCondition(asyncStatus === "success", { onSuccess: [onSuccessUpdate, reset] });

  const handleUpdateProblemSet = () => {
    if (!userId) {
      logError("User is not authenticated.", "ユーザーが認証されていません。ログインしてください。");
      return;
    }
    const problemSetService = serviceFactory.createProblemSetService();
    callAsyncFunction(problemSetService.updateProblemSet.bind(problemSetService), [userId, problemSet.docId, formState], onFailedMessage);
  }

  return { asyncStatus, errorMessage, handleUpdateProblemSet };
}

export default useUpdateProblemSetHandler;