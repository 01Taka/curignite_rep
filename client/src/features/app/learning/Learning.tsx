import { Box } from '@mui/material';
import React, { useState } from 'react';
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
  const { expandTasks, taskPreviews } = usePreviewTasks({ taskOrder: [] });

  const {
    isRunning,
    timeMs,
    timeLog,
    switchRunning,
    handleSetCurrentState,
  } = useLearningTimeManager({ learningState, setLearningState });

  return (
    <Box>
      <Box>
        <LearningStateDisplay currentState={learningState} />
        <TimeDisplay timeMs={timeMs} />
      </Box>
      
      <WorkOnTasksManager
        taskPreviews={taskPreviews}
      />

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
        expandTasks={expandTasks}
        taskPreviews={taskPreviews}
        switchRunning={switchRunning}
        onClose={() => setOpenPopup(null)}
      />
    </Box>
  );
};

export default Learning;