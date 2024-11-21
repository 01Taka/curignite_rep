import { Box, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CurrentWorkOnTask from './CurrentWorkOnTask';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';

interface WorkOnTasksManagerProps { }

const WorkOnTasksManager: React.FC<WorkOnTasksManagerProps> = ({}) => {
  const [currentTask, setCurrentTask] = useState<TaskData | null>(null);

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <IconButton size='large'>
        <ArrowBackIosNew />
      </IconButton>
      <CurrentWorkOnTask currentTask={currentTask} onCompletedTask={() => {}}/>
      <IconButton size='large'>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default WorkOnTasksManager;