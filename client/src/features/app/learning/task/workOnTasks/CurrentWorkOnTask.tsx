import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';

interface CurrentWorkOnTaskProps {
  currentTask: TaskData | null;
  onCompletedTask: (task: TaskData) => void;
}

const CurrentWorkOnTask: React.FC<CurrentWorkOnTaskProps> = ({ currentTask, onCompletedTask }) => {
  return (
    <Box>
      {currentTask &&
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          border: 2,
          borderColor: 'red',
          borderRadius: 2,
          padding: 2
        }}>
          <Typography>
            {currentTask.title}
          </Typography>
          <Button size='large' onClick={() => onCompletedTask(currentTask)} variant='contained' sx={{ mt: 2 }}>
            完了
          </Button>
        </Box>
      }
    </Box>
  );
};

export default CurrentWorkOnTask;