import React from 'react';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import { Box, Typography } from '@mui/material';
import { isBeforeDateTime } from '../../../../functions/utils/dateTimeUtils';
import { dynamicStyles } from '../../../../styles/mui/dynamicStyles';
import { formatDateDifference } from '../../../../functions/utils/timeFormatUtils';
import { commonStyles } from '../../../../styles/mui/commonStyles';

interface SimpleTaskContainerProps {
  task: TaskData;
}

const SimpleTaskContainer: React.FC<SimpleTaskContainerProps> = ({ task }) => {
  const dueDateTime = task.dueDateTime ? formatDateDifference(task.dueDateTime) : '';
  const dueDateColor = task.dueDateTime && isBeforeDateTime(task.dueDateTime) ? 'red' : 'black';
  
  return (
    <Box sx={{
      ...commonStyles.flexCenter,
      ...dynamicStyles.card()
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