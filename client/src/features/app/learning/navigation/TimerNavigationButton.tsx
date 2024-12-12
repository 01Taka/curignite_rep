import { Box, Fab, IconButton } from '@mui/material';
import React from 'react';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import SwitchStateButtons from './SwitchStateButtons';
import { Start, Stop, Timer } from '@mui/icons-material';
import useToggle from '../../../hooks/useToggle';
import { useLongPress } from '../../../hooks/components/useLongPress';

interface TimerNavigationButtonProps {
  isRunning: boolean;
  onSwitchRunning: () => void;
  onClickState: (state: LearningState) => void;
  onNavigate: () => void;
}

const TimerNavigationButton: React.FC<TimerNavigationButtonProps> = ({ isRunning, onSwitchRunning, onClickState, onNavigate }) => {
  const { open, toOpen, toClose } = useToggle();

  const handleSwitchRunning = () => {
    onSwitchRunning();
    toClose();
  }

  const handleChangeState = (state: LearningState) => {
    onClickState(state);
    toClose();
  }

  const onShotPressTimer = () => {
    if (open) {
      toClose();
    } else {
      onNavigate();
    }
  }

  const longPressHandlers = useLongPress({
    onShortPress: onShotPressTimer,
    onLongPress: () => toOpen(),
    threshold: 300
  });

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton {...longPressHandlers} >
        <Timer />
      </IconButton>
      {open &&
        <Box sx={{ position: "absolute", left: -25 }}>
          <Box sx={{ display: 'flex', gap: 1 }} >
            <Fab size='small' onClick={handleSwitchRunning} >
              {isRunning ? <Stop /> : <Start />}
            </Fab>
            <SwitchStateButtons onClickState={handleChangeState} />
          </Box>
        </Box>
      }
    </Box>
  );
};

export default TimerNavigationButton;
