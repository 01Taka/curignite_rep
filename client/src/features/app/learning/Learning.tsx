import { Box } from '@mui/material';
import React, { useState } from 'react';
import ChooseSettingPopups from './popups/ChooseSettingPopups';
import TaskOrder from './task/settings/TaskOrder';
import TaskPreview from './task/taskPreview/TaskPreview';
import WorkOnTasksManager from './task/workOnTasks/WorkOnTasksManager';
import { usePreviewTasks } from './shared/hooks/task/usePreviewTasks';
import TopNavigation from './navigation/TopNavigation';
import { LearningState } from '../../../types/firebase/db/learning/learningSupplementTypes';
import useLearningTimeManager from './shared/hooks/task/useLearningTimeManager';
import TimeDisplay from './learningState/TimeDisplay';
import LearningPopups from './popups/LearningPopups';
import { LearningPopup } from './shared/types/task/taskPopupTypes';
import LearningStateDisplay from './learningState/LearningStateDisplay';

interface LearningProps { }

const Learning: React.FC<LearningProps> = () => {
  const [learningState, setLearningState] = useState<LearningState>("study");
  const [openPopup, setOpenPopup] = useState<LearningPopup | null>(null);
  const { taskPreviews } = usePreviewTasks();

  const {
    isRunning,
    timeMs,
    timeLog,
    switchRunning,
    handleSetCurrentState,
  } = useLearningTimeManager({ learningState, setLearningState });

  return (
    <div>
      <TaskOrder tasks={taskPreviews} />
      <Box>
        <LearningStateDisplay currentState={learningState} />
        <TimeDisplay timeMs={timeMs} />
      </Box>
      
      <TaskPreview tasks={taskPreviews} />
      <WorkOnTasksManager />
      <ChooseSettingPopups />

      <TopNavigation
        isRunning={isRunning}
        onChangeState={handleSetCurrentState}
        onSwitchRunning={switchRunning}
        setOpenPopup={setOpenPopup}
      />
      <LearningPopups
        learningHistory={timeLog}
        openPopup={openPopup}
        isRunning={isRunning}
        timeMs={timeMs}
        learningState={learningState}
        switchRunning={switchRunning}
        onClose={() => setOpenPopup(null)}
      />
    </div>
  );
};

export default Learning;