import { Box, Fab } from '@mui/material';
import React from 'react';
import { learningStates, learningStateColorLabel, learningStateLabels } from '../shared/constants/learningConstants';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { commonStyles } from '../../../../styles/mui/commonStyles';

interface SwitchModeButtonsProps {
  onClickState: (state: LearningState) => void;
}

const SwitchStateButtons: React.FC<SwitchModeButtonsProps> = ({ onClickState}) => {
  return (
    <Box sx={{ ...commonStyles.flexColumnCenter, gap: 1 }}>
      {learningStates.map((state) => (
        <Fab
          key={state}
          size='small'
          sx={{
            bgcolor: learningStateColorLabel[state],
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
          }}
          onClick={() => onClickState(state)}
        >
          {learningStateLabels[state]}
        </Fab>
      ))}
    </Box>
  );
};

export default SwitchStateButtons;