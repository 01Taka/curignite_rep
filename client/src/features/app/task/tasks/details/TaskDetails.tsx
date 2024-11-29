import { Box, Typography } from '@mui/material';
import React from 'react';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { format } from 'date-fns';
import { convertToDate, formatDateDifference, isBeforeDateTime } from '../../../../../functions/utils/dateTimeUtils';
import { ja } from 'date-fns/locale';
import TaskDetailHeading from './TaskDetailHeading';

interface TaskDetailsProps {
  task: TaskData;
}

const boxStyle = {
  bgcolor: 'white',
  borderRadius: 2,
  padding: 1,
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const dueDateColor = task.dueDateTime && isBeforeDateTime(task.dueDateTime) ? 'red' : 'black';

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: 1,
      bgcolor: 'beige',
      height: '95vh'
    }}>
      <TaskDetailHeading task={task} sx={boxStyle} />
      <Box sx={boxStyle}>
        {task.dueDateTime ? (
          <Typography color={dueDateColor}>
            {formatDateDifference(task.dueDateTime)}<br />
            {format(convertToDate(task.dueDateTime), 'yyyy/MM/dd (E)', { locale: ja })}
          </Typography>
        ) : (
          <Typography color='GrayText'>
            期限日の追加
          </Typography>
        )}
      </Box>
      <Box sx={boxStyle}>
        {task.taskNote ? (
          <Typography>
            {task.taskNote}
          </Typography>
        ) : (
          <Typography color='GrayText'>
            メモの追加
          </Typography>
        )}
      </Box>
      
    </Box>
  );
};

export default TaskDetails;