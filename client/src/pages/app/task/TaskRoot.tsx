import React from 'react';
import TaskManager from '../../../features/app/task/TaskManager';
import { Route, Routes } from 'react-router-dom';
// import GoalSettingForm from '../../../features/app/task/goalSetting/GoalSettingForm';

interface TaskRootProps {}

const TaskRoot: React.FC<TaskRootProps> = () => {
  return (
    <Routes>
      <Route path='/*' element={<TaskManager />} />
    </Routes>
  );
};

export default TaskRoot;