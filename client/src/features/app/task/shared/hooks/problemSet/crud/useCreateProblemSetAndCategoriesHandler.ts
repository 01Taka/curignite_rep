import { useCallback, useState } from "react";
import useEffectOnCondition from "../../../../../../hooks/common/useEffectOnCondition";
import { CreateProblemSetFormState, CreateProblemSetStateTypes } from "../../../types/createTask/createProblemSetTypes";
import useMultipleAsyncHandler from "../../../../../../hooks/form/useMultipleAsyncHandler";
import { MINUTES_IN_MILLISECOND } from "../../../../../../../constants/utils/dateTimeConstants";
import serviceFactory from "../../../../../../../firebase/db/factory";

const useCreateProblemSetAndCategoriesHandler = (
  formState: CreateProblemSetFormState,
  userId: string | null,
  onSuccessWholeCreate: () => void,
  onFailedCreateProblemSetMessage?: string,
  onFailedCreateCategoriesMessage?: string,
) => {
  const {
    asyncStates,
    allMatchStates,
    callAsyncFunction,
    setGlobalError,
    reset
  } = useMultipleAsyncHandler<CreateProblemSetStateTypes>(["createProblemSet", "createCategory"]);

  const [isLoading, setIsLoading] = useState(false);

  // 統一エラーハンドリング関数
  const handleError = useCallback(
    (error: unknown, message: string) => {
      console.error(error);
      setGlobalError({ error, message });
    },
    [setGlobalError]
  );

  // 成功時のリセットロジック
  useEffectOnCondition(
    allMatchStates === "success",
    {
      onSuccess: [
        onSuccessWholeCreate,
        () => reset("createProblemSet"),
        () => reset("createCategory"),
        () => setIsLoading(false)
      ]
    }
  );

  const handleCreateProblemSet = useCallback(async () => {
    if (!userId) {
      handleError(new Error("User is not authenticated."), "ユーザーが認証されていません。ログインしてください。");
      return;
    }

    setIsLoading(true);

    const problemSetService = serviceFactory.createProblemSetService();
    const categoryService = serviceFactory.createProblemSetCategoryService();

    const problemSetData = await callAsyncFunction(
      "createProblemSet",
      [userId, formState.name, "", formState.description, formState.activityManagementMethod],
      problemSetService.createProblemSet.bind(problemSetService),
      onFailedCreateProblemSetMessage
    );

    if (!problemSetData) {
      setIsLoading(false);
      return;
    };

    // カテゴリ作成
    formState.categories.forEach((category) =>
      callAsyncFunction(
        "createCategory",
        [
          userId,
          problemSetData.id,
          category.name,
          formState.activityManagementMethod === "page",
          category.timePerProblem * MINUTES_IN_MILLISECOND,
          category.totalProblemNumber
        ],
        categoryService.createCategory.bind(categoryService),
        onFailedCreateCategoriesMessage
      )
    );

    // useEffectOnCondition内でisLoadingをリセット
  }, [userId, formState, callAsyncFunction, handleError, onFailedCreateProblemSetMessage, onFailedCreateCategoriesMessage]);

  return { asyncStates, allMatchStates, isLoading, handleCreateProblemSet };
};

export default useCreateProblemSetAndCategoriesHandler;
