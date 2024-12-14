import React from 'react';
import { TaskPlanExpansion } from '../../../../../types/firebase/db/user/userTaskPlanStructure';
import TaskOrder from '../../task/settings/TaskOrder';
import { TaskPreview } from '../../shared/types/task/taskPreviewTypes';

interface TaskPopupProps {
  expandTasks: TaskPlanExpansion;
  taskPreviews: TaskPreview[];
}

const TaskPopup: React.FC<TaskPopupProps> = ({ taskPreviews }) => {
  return (
    <div>
      <TaskOrder tasks={taskPreviews} />
      {/* <TaskPreview tasks={taskPreviews} /> */}
    </div>
  );
};

export default TaskPopup;