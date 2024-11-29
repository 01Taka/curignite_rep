import React from 'react';
import ChooseSettingPopups from '../../../features/app/learning/popups/ChooseSettingPopups';
import LearningStateManager from '../../../features/app/learning/learningState/LearningStateManager';
import { Box } from '@mui/material';
import ProblemSetStep from '../../../features/app/task/step/problemSetStep/ProblemSetStep';
import QuickPlanEntry from '../../../features/app/task/step/problemSetStep/quickPlanEntry/QuickPlanEntry';
import Prob from '../../../features/app/task/step/problemSetStep/quickPlanEntry/SelectDateCalendar';
import { useAppSelector } from '../../../redux/hooks';
import TaskPreview from '../../../features/app/learning/task/taskPreview/TaskPreview';
import WorkOnTasksManager from '../../../features/app/learning/task/workOnTasks/WorkOnTasksManager';
import { usePreviewTasks } from '../../../features/app/learning/task/shared/usePreviewTasks';
import TaskOrder from '../../../features/app/learning/task/settings/TaskOrder';

interface LearningRootProps { }

const LearningRoot: React.FC<LearningRootProps> = () => {
  // return <ProblemSetStep />
  // const { tasks } = useAppSelector(state => state.taskSlice);
  // console.log(tasks);
  const { taskPreviews } = usePreviewTasks();


  return (
    <div>
      <Box sx={{
        marginTop: 12
      }}>
        <LearningStateManager />
      </Box>
      <TaskOrder tasks={taskPreviews} />
      
      <TaskPreview tasks={taskPreviews} />
      <WorkOnTasksManager />
      <ChooseSettingPopups />
    </div>
  );
};

export default LearningRoot;