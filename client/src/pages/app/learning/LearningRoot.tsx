import React from 'react';
import ChooseSettingPopups from '../../../features/app/learning/popups/ChooseSettingPopups';
import LearningStateManager from '../../../features/app/learning/learningState/LearningStateManager';
import { Box } from '@mui/material';
import WorkOnTasksManager from '../../../features/app/learning/workOnTasks/WorkOnTasksManager';
import ProblemSetStep from '../../../features/app/task/step/problemSetStep/ProblemSetStep';
import QuickPlanEntry from '../../../features/app/task/step/problemSetStep/quickPlanEntry/QuickPlanEntry';
import useProblemSet from '../../../features/app/task/hooks/useProblemSet';
import Prob from '../../../features/app/task/step/problemSetStep/quickPlanEntry/SelectDateCalendar';
import { useAppSelector } from '../../../redux/hooks';

interface LearningRootProps { }

const LearningRoot: React.FC<LearningRootProps> = () => {
  return <ProblemSetStep />
//   const { tasks } = useAppSelector(state => state.taskSlice);
// console.log(tasks);

  return (
    <div>
      <Box sx={{
        marginTop: 12
      }}>
        <LearningStateManager />
      </Box>
      
      <WorkOnTasksManager />
      <ChooseSettingPopups />
    </div>
  );
};

export default LearningRoot;