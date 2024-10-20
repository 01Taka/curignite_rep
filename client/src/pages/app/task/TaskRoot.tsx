import React from 'react';
import TaskManager from '../../../features/app/task/taskManager/TaskManager';
import GoalSettingForm from '../../../features/app/task/goalSetting/GoalSettingForm';

interface TaskRootProps { }

const TaskRoot: React.FC<TaskRootProps> = () => {
  return (
    <div>
      <GoalSettingForm />
      <TaskManager />
    </div>
  );
};

export default TaskRoot;