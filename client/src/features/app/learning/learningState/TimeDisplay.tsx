import React from 'react';
import { splitMillisWithFormat } from '../../../../functions/utils/timeFormatUtils';
import { Box } from '@mui/material';

interface TimeDisplayProps {
  timeMs: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeMs }) => {
  const { seconds, minutes, hours } = splitMillisWithFormat(timeMs, { hideZeroHours: true });

  return (
    <Box sx={{ display: 'inline-block', fontSize: '1.5rem', fontFamily: 'monospace' }}>
      {hours && hours + ':'}{minutes}:{seconds}
    </Box>
  );
};

export default TimeDisplay;
