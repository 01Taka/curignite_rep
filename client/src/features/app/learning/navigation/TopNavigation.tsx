import { Box } from '@mui/material';
import React from 'react';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { LearningPopup } from '../shared/types/task/taskPopupTypes';
import TimerNavigationButton from './timer/TimerNavigationButton';
import ExitNavigation from './exit/ExitNavigation';
import TaskNavigation from './task/TaskNavigation';

interface TopNavigationProps {
  isRunning: boolean;
  onSwitchRunning: () => void;
  onChangeState: (state: LearningState) => void;
  setOpenPopup: (popup: LearningPopup) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ isRunning, onSwitchRunning, onChangeState, setOpenPopup }) => {
  return (
    <Box sx={{ position: 'fixed', display: 'flex', justifyContent: "space-between", width: "100%", height: 50, top: 0}}>
      <Box />
      <Box />
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
        <TimerNavigationButton
          isRunning={isRunning}
          onSwitchRunning={onSwitchRunning}
          onClickState={onChangeState}
          onNavigate={() => setOpenPopup("timer")}
        />
        <TaskNavigation onNavigate={() => setOpenPopup("task")} />
        <ExitNavigation onNavigate={() => setOpenPopup("exit")} />
      </Box>
    </Box>
  );
};

export default TopNavigation;