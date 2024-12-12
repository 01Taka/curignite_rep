import React from 'react';
import LearningTimeHistory from '../learningState/LearningTimeHistory';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import LearningStateDisplay from '../learningState/LearningStateDisplay';
import TimeDisplay from '../learningState/TimeDisplay';
import { Box, Button, Typography } from '@mui/material';
import { Start, Stop } from '@mui/icons-material';
import { commonStyles } from '../../../../styles/mui/commonStyles';

interface TimerStatusProps {
  isRunning: boolean;
  learningState: LearningState;
  timeMs: number;
  learningHistory: Record<LearningState, number>;
  switchRunning: () => void;
}

const TimerStatus: React.FC<TimerStatusProps> = ({ isRunning, learningState, timeMs, learningHistory, switchRunning }) => {
  return (
    <Box>
      <LearningStateDisplay currentState={learningState} />
      <TimeDisplay timeMs={timeMs} />
      <Button size="large"  variant="outlined" onClick={switchRunning}>
        {isRunning ? (
          <Box sx={{ ...commonStyles.flexCenter, gap: 1 }} >
            <Typography>停止</Typography>
            <Stop />
          </Box>
        ) : (
          <Box sx={{ ...commonStyles.flexCenter, gap: 1 }} >
            <Typography>再開</Typography>
            <Start />
          </Box>
        )}
      </Button>
      <LearningTimeHistory history={learningHistory} />
    </Box>
  );
};

export default TimerStatus;