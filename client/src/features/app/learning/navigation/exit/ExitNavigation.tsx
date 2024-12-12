import { Flag } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';

interface ExitNavigationProps {
  onNavigate: () => void;
}

const ExitNavigation: React.FC<ExitNavigationProps> = ({ onNavigate }) => {
  return (
    <IconButton onClick={onNavigate}>
      <Flag />
    </IconButton>
  );
};

export default ExitNavigation;