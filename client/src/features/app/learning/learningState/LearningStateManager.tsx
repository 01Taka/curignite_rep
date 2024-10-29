import { Box } from '@mui/material';
import React, { useState } from 'react';
import LearningStateDisplay from './LearningStateDisplay';
import LearningStateSelector from './LearningStateSelector';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';

interface LearningStateManagerProps { }

const LearningStateManager: React.FC<LearningStateManagerProps> = () => {
  const [currentState, setCurrentState] = useState<LearningState>('study');
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <LearningStateSelector currentState={currentState} onSelectState={setCurrentState}/>
      <LearningStateDisplay currentState={currentState} />
    </Box>
  );
};

export default LearningStateManager;