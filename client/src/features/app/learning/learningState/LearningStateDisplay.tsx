import React from 'react';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { Box, Button, Typography } from '@mui/material';
import { learningStateLabels } from '../shared/constants/learningConstants';
import FireAnimation from '../animation/FireAnimation';
import WaterRingAnimation from '../animation/WaterRingAnimation';
import RotatingSquare from '../animation/RotatingSquare';
import ShakingHexagon from '../animation/ShakingHexagon';

interface LearningStateDisplayProps {
  currentState: LearningState;
}

interface ShapeSelectorProps {
  state: LearningState;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({ state }) => {
  switch (state) {
    case 'focus':
      return <FireAnimation />
    case 'study':
      return <WaterRingAnimation />
    case 'break':
      return <RotatingSquare />
    case 'away':
      return <ShakingHexagon size={110}/>
    default:
      return null;
  }
}




const LearningStateDisplay: React.FC<LearningStateDisplayProps> = ({ currentState }) => {
  return (
    <Box sx={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 120,
      height: 120
    }}>
      <ShapeSelector state={currentState} />
      <Typography variant='h6' sx={{ position: 'absolute', fontWeight: 'bold' }} >
        {learningStateLabels[currentState]}
      </Typography>
    </Box>
  );
};

export default LearningStateDisplay;