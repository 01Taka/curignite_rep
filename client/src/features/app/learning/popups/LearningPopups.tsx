import React from 'react';
import Popup from '../../../../components/display/popup/Popup';
import TimerStatus from './timer/TimerStatus';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { LearningPopup } from '../shared/types/task/taskPopupTypes';
import { Box } from '@mui/material';
import ExitPopup from './exit/ExitPopup';
import TaskPopup from './task/TaskPopup';
import { TaskPlanExpansion } from '../../../../types/firebase/db/user/userTaskPlanStructure';
import { IndividualTaskPreview, ProblemSetTaskPreviewById } from '../shared/types/task/taskPreviewTypes';

interface LearningPopupsProps {
  openPopup: LearningPopup | null;
  learningHistory: Record<LearningState, number>;
  isRunning: boolean;
  timeMs: number;
  learningState: LearningState;
  expandTasks: TaskPlanExpansion;
  taskPreviews: (IndividualTaskPreview | ProblemSetTaskPreviewById)[];
  onClose: () => void;
  switchRunning: () => void;
}

const LearningPopups: React.FC<LearningPopupsProps> = ({
  openPopup,
  learningHistory,
  isRunning,
  timeMs,
  learningState,
  expandTasks,
  taskPreviews,
  onClose,
  switchRunning
  }) => {
  
  return (
    <Popup open={openPopup !== null} handleClose={onClose} >
      <Box sx={{ height: "95vh", bgcolor: "whitesmoke", overflow: "auto", p: 1, borderRadius: 2 }}>
        {openPopup === "timer" ? (
          <TimerStatus
            isRunning={isRunning}
            timeMs={timeMs}
            learningState={learningState}
            learningHistory={learningHistory}
            switchRunning={switchRunning}
          />
        ) : openPopup === "task" ? (
          <TaskPopup
            expandTasks={expandTasks}
            taskPreviews={taskPreviews}
          />
        ) : openPopup === "exit" ? (
          <ExitPopup
            onClose={onClose}
          />
        ) : null}
      </Box>
    </Popup>
  );
};

export default LearningPopups;