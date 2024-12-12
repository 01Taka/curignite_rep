import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { appPaths } from '../../../../../constants/app/path/appPath';

interface ExitPopupProps {
  onClose: () => void;
}

const ExitPopup: React.FC<ExitPopupProps> = ({ onClose }) => {
  const navigation = useNavigate();

  return (
    <Box>
      <Typography variant='h5' >
        学習を終えますか？
      </Typography>
      <Button variant="outlined" onClick={onClose} >
        キャンセル
      </Button>
      <Button variant="contained" onClick={() => navigation(appPaths._abs)} >
        終える
      </Button>
    </Box>
  );
};

export default ExitPopup;