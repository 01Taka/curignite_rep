import { Button } from '@mui/material';
import React from 'react';
import { modeColorLabels, modeTextLabels } from '../../shared/constants/labels';
import { PlanMode } from '../../shared/types/plan/planTargetTypes';

interface ModeSelectButtonProps {
  mode: PlanMode;
  onChangeMode: (mode: PlanMode) => void;
}

const ModeSelectButton: React.FC<ModeSelectButtonProps> = ({ mode, onChangeMode }) => {
  return (
    <Button
      variant="outlined"
      size="small"
      sx={{
        color: "black",
        bgcolor: modeColorLabels[mode],
      }}
      onClick={() => onChangeMode("common")}
    >
      {modeTextLabels[mode]}
    </Button> 
  );
};

export default ModeSelectButton;