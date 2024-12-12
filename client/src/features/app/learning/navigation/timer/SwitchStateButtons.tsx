import { Box, Fab } from '@mui/material';
import React from 'react';
import { commonStyles } from '../../../../../styles/mui/commonStyles';
import { LearningState } from '../../../../../types/firebase/db/learning/learningSupplementTypes';
import { learningStates, learningStateColorLabel, learningStateLabels } from '../../shared/constants/learningConstants';

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