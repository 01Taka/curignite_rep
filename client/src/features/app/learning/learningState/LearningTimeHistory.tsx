import React from 'react';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { Box, Typography } from '@mui/material';
import { learningStateColorLabel, learningStateLabels } from '../shared/constants/learningConstants';
import { millisToTime } from '../../../../functions/utils/timeFormatUtils';

interface TimeHistoryProps {
  history: Record<LearningState, number>;
}

const LearningTimeHistory: React.FC<TimeHistoryProps> = ({ history }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: "column", gap: 1 }}>
      {Object.entries(history).map(([state, timeMs]) => (
        <Box key={state} sx={{ display: 'flex', bgcolor: learningStateColorLabel[state as LearningState], p: 0.5, borderRadius: 1 }}>
          <Typography sx={{ ml: 2, mr: 4  }}>
            {learningStateLabels[state as LearningState]}
          </Typography>
          <Typography>
            {millisToTime(timeMs)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default LearningTimeHistory;