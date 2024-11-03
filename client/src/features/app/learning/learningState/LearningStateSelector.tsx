import React from 'react';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { Box, Button } from '@mui/material';
import { learningStateLabels, learningStates } from '../../../../constants/firebase/db/learningConstants';
import { HexColorCode } from '../../../../types/util/utilTypes';

interface LearningStateSelectorProps {
  currentState: LearningState;
  onSelectState: (state: LearningState) => void;
}

const colorLabel: Record<LearningState, HexColorCode> = {
  focus: '#ef5a00',
  study: '#00aaff',
  break: '#61c965',
  away: '#999'
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
              color: 'black',
              bgcolor: colorLabel[state],
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