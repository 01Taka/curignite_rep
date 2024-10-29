import React from 'react';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { Box, Button } from '@mui/material';
import { learningStateLabels, learningStates } from '../../../../constants/firebase/db/learningConstants';

interface LearningStateSelectorProps {
  currentState: LearningState;
  onSelectState: (state: LearningState) => void;
}

const LearningStateSelector: React.FC<LearningStateSelectorProps> = ({ currentState, onSelectState }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.2rem'
    }}>
      {learningStates.filter(state => state !== currentState).map(state => (
        <Box key={state} sx={{
          textAlign: 'center',
          alignContent: 'center'
        }}>
          <Button sx={{
              width: 36,
              height: 36,
              border: 1,
              borderColor: 'skyblue',
              borderRadius: 999,
            }}
            onClick={() => onSelectState(state)}
          >
            {learningStateLabels[state]}
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default LearningStateSelector;