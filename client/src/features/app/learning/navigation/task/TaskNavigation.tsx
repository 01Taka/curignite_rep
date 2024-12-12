import { Article } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';

interface TaskNavigationProps {
  onNavigate: () => void;
}

const TaskNavigation: React.FC<TaskNavigationProps> = ({ onNavigate }) => {
  return (
    <IconButton onClick={onNavigate}>
      <Article />
    </IconButton>
  );
};

export default TaskNavigation;