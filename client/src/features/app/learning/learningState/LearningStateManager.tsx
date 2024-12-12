import { Box } from '@mui/material';
import React, {  } from 'react';
import LearningStateDisplay from './LearningStateDisplay';
import LearningStateSelector from './LearningStateSelector';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { commonStyles } from '../../../../styles/mui/commonStyles';

interface LearningStateManagerProps {
  learningState: LearningState;
  setLearningState: (state: LearningState) => void;
}

const LearningStateManager: React.FC<LearningStateManagerProps> = ({ learningState, setLearningState }) => {


  return (
    <Box sx={{
      ...commonStyles.flexColumnCenter,
      gap: '1rem',
      width: "100%",
      position: "relative"
    }}>
      <Box sx={{ position: "absolute", height: 0, width: 0, left: 30, top: 0 }} >
        <LearningStateSelector onSelectState={setLearningState}/>
      </Box>
      <LearningStateDisplay currentState={learningState} />

    </Box>
  );
};

export default LearningStateManager;
