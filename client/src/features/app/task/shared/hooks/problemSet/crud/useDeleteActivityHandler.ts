import useAsyncHandler from "../../../../../../hooks/form/useAsyncHandler";
import serviceFactory from "../../../../../../../firebase/db/factory";
import { useAppSelector } from "../../../../../../../redux/hooks";

const useDeleteActivityHandler = (problemSetId: string, activityId: string, onFailedMessage?: string) => {
  const userId = useAppSelector(state => state.userSlice.uid);
  const { asyncStatus, errorMessage, callAsyncFunction, logError } = useAsyncHandler();

  const handleDeleteActivity = () => {
    if (!userId) {
      logError("User is not authenticated.", "ユーザーが認証されていません。ログインしてください。");
      return;
    }
    const activityService = serviceFactory.createProblemSetActivityService();
    callAsyncFunction(activityService.hardDeleteActivity.bind(activityService), [userId, problemSetId, activityId], onFailedMessage);
  }

  return { asyncStatus, errorMessage, handleDeleteActivity };
}

export default useDeleteActivityHandler;