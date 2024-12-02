import useAsyncHandler from "../../../../../../hooks/form/useAsyncHandler";
import serviceFactory from "../../../../../../../firebase/db/factory";
import { useAppSelector } from "../../../../../../../redux/hooks";

const useDeleteProblemSet = (problemSetId: string, onFailedMessage?: string) => {
  const userId = useAppSelector(state => state.userSlice.uid);
  const { asyncStatus, errorMessage, callAsyncFunction, setErrorMessage } = useAsyncHandler();

  const handleDeleteActivity = () => {
    if (!userId) {
      console.error('User is not authenticated.');
      setErrorMessage("ユーザーが認証されていません。ログインしてください。");
      return;
    }
    const problemSetService = serviceFactory.createProblemSetService();
    callAsyncFunction([userId, problemSetId], problemSetService.hardDeleteActivity.bind(problemSetService), onFailedMessage);
  }

  return { asyncStatus, errorMessage, handleDeleteActivity };
}

export default useDeleteProblemSet;