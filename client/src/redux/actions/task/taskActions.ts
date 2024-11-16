import serviceFactory from "../../../firebase/db/factory"
import { TaskManagementService } from "../../../firebase/db/util/taskManagementService"
import { IndividualTaskRead, ProblemSetActivityRead, ProblemSetCategoryRead, ProblemSetRead } from "../../../types/firebase/db/task/taskStructure";
import { AppDispatch } from "../../../types/module/redux/reduxTypes";
import { setCategoryMap, setIndividualTasks, setActivityMap, setProblemSetMap } from "../../slices/task/taskSlice";
import store from "../../store";

const mapToDocIdMap = <T extends { docId: string }>(items: T[]): Record<string, T> => {
  return Object.fromEntries(items.map(item => [item.docId, item]));
};

const a = (args: {problemSet: ProblemSetRead, activities?: ProblemSetActivityRead[], categories?: ProblemSetCategoryRead[] }) => {
  const taskData = store.getState().taskSlice;
  const problemSet = args.problemSet;
  // const activities = args.activities ?? taskData.problemSetActivities
}

const dispatchCallbackWithProblemSetIds = (userId: string, problemSetMap: Record<string, ProblemSetRead>, dispatch: AppDispatch) => {
  const dispatchProblemSetActivity = (args: { userId: string; problemSetId: string; data: ProblemSetActivityRead[] }) => {
    const problemSet = problemSetMap[args.problemSetId];
    dispatch(setActivityMap(mapToDocIdMap(args.data)));
  }
  const dispatchProblemSetCategory = (args: { userId: string; problemSetId: string; data: ProblemSetCategoryRead[] }) => {
    dispatch(setCategoryMap(mapToDocIdMap(args.data)));
  }
  const problemSetIds = Object.keys(problemSetMap);
  TaskManagementService.addCollectionCallbackForAllActivities(serviceFactory, userId, problemSetIds, dispatchProblemSetActivity);
  TaskManagementService.addCollectionCallbackForAllCategories(serviceFactory, userId, problemSetIds, dispatchProblemSetCategory);
}

const dispatchCallback = (userId: string, dispatch: AppDispatch) => {
  // const dispatchIndividualTasks = (tasks: IndividualTaskRead[]) => {
  //   dispatch(setIndividualTasks(tasks));
  // }
  // const dispatchProblemSet = (problemSets: ProblemSetRead[]) => {
  //   const problemSetMap = mapToDocIdMap(problemSets);
  //   dispatchCallbackWithProblemSetIds(userId, problemSetMap, dispatch);
  //   dispatch(setProblemSetMap(problemSetMap));
  // }
  
  // serviceFactory.createIndividualTaskService().addCollectionCallback(userId, dispatchIndividualTasks);
  // serviceFactory.createProblemSetService().addCollectionCallback(userId, dispatchProblemSet);
}