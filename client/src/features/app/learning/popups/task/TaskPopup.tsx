import React from 'react';
import { TaskPlanExpansion } from '../../../../../types/firebase/db/user/userTaskPlanStructure';
import { IndividualTaskPreview, ProblemSetTaskPreviewById } from '../../shared/types/task/taskPreviewTypes';
import TaskOrder from '../../task/settings/TaskOrder';
import TaskPreview from '../../task/taskPreview/TaskPreview';

interface TaskPopupProps {
  expandTasks: TaskPlanExpansion;
  taskPreviews: (IndividualTaskPreview | ProblemSetTaskPreviewById)[];
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