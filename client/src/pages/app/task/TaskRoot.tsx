import React from 'react';
import TaskManager from '../../../features/app/task/TaskManager';
import { Route, Routes } from 'react-router-dom';
import { appPaths } from '../../../constants/app/path/appPath';
import useDefaultNavigation from '../../../features/hooks/navigate/useDefaultNavigation';
import { getPathList } from '../../../functions/utils/pathUtils';
import ProblemSets from '../../../features/app/task/problemSets/ProblemSets';
import Tasks from '../../../features/app/task/tasks/Tasks';
// import GoalSettingForm from '../../../features/app/task/goalSetting/GoalSettingForm';

interface TaskRootProps {}

const TaskRoot: React.FC<TaskRootProps> = () => {
  useDefaultNavigation(appPaths.task.list._abs, getPathList(appPaths.task, { includeRoot: false }));

  return (
    <Routes>
      <Route path='/*' element={<TaskManager />}>
        <Route path={appPaths.task.list._rel} element={<Tasks />} />
        <Route path={appPaths.task.problemSets._rel} element={<ProblemSets />} />
      </Route>
    </Routes>
  );
};

export default TaskRoot;