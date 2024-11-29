import { IndividualTaskService } from "../../../firebase/db/app/user/subCollection/task/individualTaskService";
import { ProblemSetActivityService } from "../../../firebase/db/app/user/subCollection/task/problemSetActivityService";
import { ProblemSetCategoryService } from "../../../firebase/db/app/user/subCollection/task/problemSetCategoryService";
import { ProblemSetService } from "../../../firebase/db/app/user/subCollection/task/problemSetService";
import serviceFactory from "../../../firebase/db/factory";
import { TaskManagementService } from "../../../firebase/db/util/taskManagementService";
import { objectArrayToDict } from "../../../functions/utils/objectUtils";
import {
  IndividualTaskRead,
  ProblemSetActivityRead,
  ProblemSetCategoryRead,
  ProblemSetRead,
} from "../../../types/firebase/db/task/taskStructure";
import { AppDispatch } from "../../../types/module/redux/reduxTypes";
import { setTaskSliceState } from "../../slices/task/taskSlice";
import store from "../../store";
import { nanoid } from "nanoid";

class IDManager {
  private static _idMap: Map<string, string> = new Map();

  static getId(genre: string): string {
    if (!this._idMap.has(genre)) {
      this._idMap.set(genre, `${genre}_${nanoid()}`);
    }
    return this._idMap.get(genre)!;
  }

  // IDManagerのリセット機能を追加
  static reset() {
    this._idMap.clear();
  }
}

// 型定義
type TaskData = Partial<{
  individualTasks: IndividualTaskRead[];
  problemSets: ProblemSetRead[];
  activities: ProblemSetActivityRead[];
  categories: ProblemSetCategoryRead[];
}>;

// サービス依存性注入用の型
interface TaskServices {
  individualTaskService: IndividualTaskService;
  problemSetService: ProblemSetService;
  categoryService: ProblemSetCategoryService;
  activityService: ProblemSetActivityService;
}

// TaskManagerのファクトリ関数
export const createTaskManager = (services: TaskServices) => {
  // 追加: ロック機構を管理するフラグ
  let isDispatching = false;

  // ディスパッチ用のデータ更新関数
  const dispatchData = async (data: TaskData, dispatch: AppDispatch) => {
    if (isDispatching) return; // ロックされている場合は処理しない
    isDispatching = true;

    try {
      const state = store.getState();
      const { taskSlice } = state;
      const { individualTaskMap, problemSetMap, activityMap, categoryMap } = taskSlice;

      const storeIndividualTasks = Object.values(individualTaskMap);
      const storeProblemSets = Object.values(problemSetMap);
      const storeActivities = Object.values(activityMap);
      const storeCategories = Object.values(categoryMap);

      const newData = {
        individualTasks: data.individualTasks ?? storeIndividualTasks,
        problemSets: data.problemSets ?? storeProblemSets,
        activities: data.activities ?? storeActivities,
        categories: data.categories ?? storeCategories,
      };

      const formatData = TaskManagementService.formatDataForExport(
        newData.individualTasks,
        newData.problemSets,
        newData.categories,
        newData.activities
      );

      dispatch(setTaskSliceState({
        ...formatData,
        individualTaskMap: objectArrayToDict(newData.individualTasks, 'docId'),
      }));
    } catch (error) {
      console.error("Error in dispatchData:", error);
    } finally {
      isDispatching = false; // 処理が完了したらロック解除
    }
  };

  const dispatchCallbackWithProblemSetIds = (userId: string, dispatch: AppDispatch) => {
    const ids = Object.fromEntries(['problemSet', 'activity', 'category', 'individualTask'].map(
      genre => ([genre, IDManager.getId(genre)])
    )) as Record<'problemSet' | 'activity' | 'category' | 'individualTask', string>;

    const updateProblemSetChildCallback = (userId: string, problemSetIds: string[], dispatch: AppDispatch) => {
      // Activity 更新コールバック
      services.activityService.addCollectionCallbackToAll(userId, problemSetIds, (activities) => {
        dispatchData({ activities }, dispatch);
      }, ids.activity);

      // Category 更新コールバック
      services.categoryService.addCollectionCallbackToAll(userId, problemSetIds, (categories) => {
        dispatchData({ categories }, dispatch);
      }, ids.category);
    };

    // ProblemSet 更新コールバック
    services.problemSetService.addCollectionCallback(userId, (problemSets) => {
      const problemSetIds = problemSets.map((problemSet) => problemSet.docId);
      updateProblemSetChildCallback(userId, problemSetIds, dispatch);
      dispatchData({ problemSets }, dispatch);
    }, ids.problemSet);

    // Individual Task 更新コールバック
    services.individualTaskService.addCollectionCallback(userId, (individualTasks) => {
      dispatchData({ individualTasks }, dispatch);
    }, ids.individualTask);
  };

  const initializeTaskSlice = async (userId: string, dispatch: AppDispatch) => {
    try {
      const formatData = await TaskManagementService.fetchAllTasksAsFormatData(userId, services);
      dispatch(setTaskSliceState(formatData));
    } catch (error) {
      console.error("Failed to initialize task slice:", error);
    }
  };

  return { initializeTaskSlice, dispatchCallbackWithProblemSetIds };
};

// 使用例
const taskManager = createTaskManager({
  individualTaskService: serviceFactory.createIndividualTaskService(),
  problemSetService: serviceFactory.createProblemSetService(),
  categoryService: serviceFactory.createProblemSetCategoryService(),
  activityService: serviceFactory.createProblemSetActivityService(),
});

// 初期化例
export const initializeTasks = async (userId: string, dispatch: AppDispatch) => {
  IDManager.reset(); // IDManagerを初期化
  await taskManager.initializeTaskSlice(userId, dispatch);
};

// リアルタイム更新登録例
export const setupRealTimeUpdates = (userId: string, dispatch: AppDispatch) => {
  taskManager.dispatchCallbackWithProblemSetIds(userId, dispatch);
};

// リアルタイム更新削除例
export const removeRealTimeUpdates = (userId: string, services: TaskServices) => {
  const taskStore = store.getState().taskSlice;
  const problemSetIds = Object.keys(taskStore.problemSetMap);

  services.activityService.removeCollectionCallbackToAll(userId, problemSetIds, IDManager.getId('activity'));
  services.categoryService.removeCollectionCallbackToAll(userId, problemSetIds, IDManager.getId('category'));
  services.problemSetService.removeCollectionCallback(userId, IDManager.getId('problemSet'));
  services.individualTaskService.removeCollectionCallback(userId, IDManager.getId('individualTask'));
};
