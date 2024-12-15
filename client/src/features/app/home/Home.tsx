import { Box, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { appPaths } from '../../../constants/app/path/appPath';

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Button onClick={() => navigate(appPaths.task._abs)} >タスク</Button>
      <Button onClick={() => navigate(appPaths.plan._abs)} >プラン</Button>
      <Button onClick={() => navigate(appPaths.learning._abs)} >学習</Button>
      <Button onClick={() => navigate("/app/profile")} >プロフィール</Button>
    </Box>
  );
};

export default Home;