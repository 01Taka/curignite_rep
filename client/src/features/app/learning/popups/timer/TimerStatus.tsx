import { Stop, Start } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { commonStyles } from '../../../../../styles/mui/commonStyles';
import { LearningState } from '../../../../../types/firebase/db/learning/learningSupplementTypes';
import LearningStateDisplay from '../../learningState/LearningStateDisplay';
import LearningTimeHistory from '../../learningState/LearningTimeHistory';
import TimeDisplay from '../../learningState/TimeDisplay';

interface TimerStatusProps {
  isRunning: boolean;
  learningState: LearningState;
  timeMs: number;
  learningHistory: Record<LearningState, number>;
  switchRunning: () => void;
  onChangeState: (state: LearningState) => void;
}

const TimerStatus: React.FC<TimerStatusProps> = ({ isRunning, learningState, timeMs, learningHistory, switchRunning, onChangeState }) => {
  return (
    <Box>
      <Box sx={{ ...commonStyles.flexCenter, gap: 1, mt: 4  }}>
        <LearningStateDisplay currentState={learningState} />
        <Box sx={{ ...commonStyles.flexColumnCenter, gap: 2 }}>
          <TimeDisplay timeMs={timeMs} />
          <Button sx={{ ...commonStyles.flexCenter, gap: 1 }} size="large"  variant="outlined" onClick={switchRunning} >
            <Typography>{isRunning ? "停止" : "再開"}</Typography>
            {isRunning ? <Stop /> : <Start />}
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 1 }}>
        <LearningTimeHistory history={learningHistory} learningState={learningState} onChangeState={onChangeState} />
      </Box>
    </Box>
  );
};

export default TimerStatus;