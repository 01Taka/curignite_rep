import useAsyncHandler from "../../../../../../hooks/form/useAsyncHandler";
import serviceFactory from "../../../../../../../firebase/db/factory";
import useEffectOnCondition from "../../../../../../hooks/common/useEffectOnCondition";

const useDeleteProblemSetHandler = (userId: string | null, problemSetId: string, onSuccessDelete: () => void, onFailedMessage?: string) => {
  const { asyncStatus, errorMessage, callAsyncFunction, setErrorMessage, reset } = useAsyncHandler();

  useEffectOnCondition(asyncStatus === "success", { onSuccess: [onSuccessDelete, reset] });

  const handleDeleteActivity = () => {
    if (!userId) {
      console.error('User is not authenticated.');
      setErrorMessage("ユーザーが認証されていません。ログインしてください。");
      return;
    }
    const problemSetService = serviceFactory.createProblemSetService();
    callAsyncFunction(problemSetService.hardDeleteProblemSet.bind(problemSetService), [userId, problemSetId], onFailedMessage);
  }

  return { asyncStatus, errorMessage, handleDeleteActivity };
}

export default useDeleteProblemSetHandler;