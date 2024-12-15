import React from 'react';
import { splitMillisWithFormat } from '../../../../functions/utils/timeFormatUtils';
import { Typography } from '@mui/material';

interface TimeDisplayProps {
  timeMs: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeMs }) => {
  const { seconds, minutes, hours } = splitMillisWithFormat(timeMs, { hideZeroHours: true });

  return (
    <Typography
      sx={{ display: 'inline-block', fontFamily: 'monospace' }}
      variant='h4'
    >
      {hours && hours + ':'}{minutes}:{seconds}
    </Typography>
  );
};

export default TimeDisplay;
