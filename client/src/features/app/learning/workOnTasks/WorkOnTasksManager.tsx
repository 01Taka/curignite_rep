import { Box, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CurrentWorkOnTask from './CurrentWorkOnTask';
import useProblemSet from '../../task/hooks/useProblemSet';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

interface WorkOnTasksManagerProps { }

const WorkOnTasksManager: React.FC<WorkOnTasksManagerProps> = ({}) => {
  const [currentTask, setCurrentTask] = useState<TaskData | null>(null);

  //サンプル
  const { problemSetData } = useProblemSet();
  useEffect(() => {
    setCurrentTask(problemSetData[0]?.activities[0] ?? null);
  }, [problemSetData])


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