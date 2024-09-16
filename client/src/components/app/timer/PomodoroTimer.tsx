import React from 'react';
import { MINUTES_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';
import TimerView from './TimerView';
import { Typography, Box } from '@mui/material';

interface PomodoroTimerProps {
  isWorkTime: boolean;
  isRunning: boolean;
  currentCycle: number;
  maxCycle?: number;
  elapsedTime: number;
  workDurationMs?: number;
  breakDurationMs?: number;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isWorkTime,
  isRunning,
  currentCycle,
  maxCycle,
  elapsedTime,
  workDurationMs = 25 * MINUTES_IN_MILLISECOND,
  breakDurationMs = 5 * MINUTES_IN_MILLISECOND,
}) => {
  // サイクルのテキストを取得
  const getCycleText = () => (maxCycle ? `${currentCycle} / ${maxCycle}` : `Cycle ${currentCycle}`);

  return (
    <Box display="flex">
      <TimerView
        totalTime={isWorkTime ? workDurationMs : breakDurationMs}
        elapsedTime={elapsedTime}
        backgroundColor={isWorkTime ? '#fcbe03' : '#36b5ff'}
        progressColor={isWorkTime ? '#de9c02' : '#021cde'}
        isRunning={isRunning}
      />
      <Typography
        variant="h5"
        sx={{
          display: 'inline-block',
        }}
      >
        {getCycleText()}
      </Typography>
    </Box>
  );
};
export default PomodoroTimer;
