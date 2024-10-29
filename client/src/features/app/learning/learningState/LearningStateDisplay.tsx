import React from 'react';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { Box, Button, Typography } from '@mui/material';
import { learningStateLabels } from '../../../../constants/firebase/db/learningConstants';

interface LearningStateDisplayProps {
  currentState: LearningState;
}

const LearningStateDisplay: React.FC<LearningStateDisplayProps> = ({ currentState }) => {
  return (
    <Box>
      <Button sx={{
        width: 100,
        height: 100,
        border: 1,
        borderColor: 'skyblue',
        borderRadius: 999,
      }}
      >
        <Typography variant='h6'>
          {learningStateLabels[currentState]}
        </Typography>
      </Button>
    </Box>
  );
};

export default LearningStateDisplay;