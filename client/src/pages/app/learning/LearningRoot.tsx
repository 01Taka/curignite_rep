import React from 'react';
import ChooseSettingPopups from '../../../features/app/learning/popups/ChooseSettingPopups';
import GradientIcon from '../../../components/display/container/GradientIcon';
import LearningStateManager from '../../../features/app/learning/learningState/LearningStateManager';
import { Box } from '@mui/material';
import WorkOnTasksManager from '../../../features/app/learning/workOnTasks/WorkOnTasksManager';

interface LearningRootProps { }

const LearningRoot: React.FC<LearningRootProps> = () => {
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