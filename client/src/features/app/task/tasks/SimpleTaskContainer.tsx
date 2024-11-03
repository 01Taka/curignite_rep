import React from 'react';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import { Box, Typography } from '@mui/material';
import { formatDateDifference, isBeforeDateTime } from '../../../../functions/utils/dateTimeUtils';

interface SimpleTaskContainerProps {
  task: TaskData;
}

const SimpleTaskContainer: React.FC<SimpleTaskContainerProps> = ({ task }) => {
  const dueDateTime = task.dueDateTime ? formatDateDifference(task.dueDateTime) : '';
  const dueDateColor = task.dueDateTime && isBeforeDateTime(task.dueDateTime) ? 'red' : 'black';
  
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      padding: 1,
      border: 1,
      borderRadius: 2
    }}>
      <Typography flex={4}>
        {task.title}
      </Typography>
      {task.problemSetActivityField && 
        <Typography flex={1} sx={{ textAlign: 'center', color: task.completed ? 'lightgreen' : 'black' }} >
          {task.problemSetActivityField.completionRate}
        </Typography>
      }
      <Typography flex={2} sx={{
        textAlign: 'end',
        color: dueDateColor
      }}>
        {dueDateTime}
      </Typography>
    </Box>
  );
};

export default SimpleTaskContainer;