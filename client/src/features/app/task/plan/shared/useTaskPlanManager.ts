import { useCallback, useMemo } from "react";
import serviceFactory from "../../../../../firebase/db/factory";
import useMultipleAsyncHandler from "../../../../hooks/form/useMultipleAsyncHandler";
import { useAppSelector } from "../../../../../redux/hooks";
import { TodayTasks } from "./planTypes";

export const useTaskPlanManager = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const { callAsyncFunction } = useMultipleAsyncHandler();
  const taskPlanManager = useMemo(() => {
    return serviceFactory.createUserTaskPlanManager();
  }, []);

  const createTaskPlan = useCallback((todayTasks: TodayTasks) => {
    if (uid) {
      callAsyncFunction('create', [
        uid,
        todayTasks,
      ], taskPlanManager.createTaskPlan.bind(taskPlanManager))
    } else {
      console.error('UIDが見つかりません');
    }
  }, [uid, taskPlanManager, callAsyncFunction]);

  return { createTaskPlan }
};