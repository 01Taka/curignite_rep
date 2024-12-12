import React from 'react';
import Popup from '../../../../components/display/popup/Popup';
import TimerStatus from './TimerStatus';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { LearningPopup } from '../shared/types/task/taskPopupTypes';
import { Box } from '@mui/material';

interface LearningPopupsProps {
  openPopup: LearningPopup | null;
  learningHistory: Record<LearningState, number>;
  isRunning: boolean;
  timeMs: number;
  learningState: LearningState;
  onClose: () => void;
  switchRunning: () => void;
}

const LearningPopups: React.FC<LearningPopupsProps> = ({
  openPopup,
  learningHistory,
  isRunning,
  timeMs,
  learningState,
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
        ) : null}
      </Box>
    </Popup>
  );
};

export default LearningPopups;