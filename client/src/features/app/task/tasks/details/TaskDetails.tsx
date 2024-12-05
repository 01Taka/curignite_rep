import { Box, Typography } from '@mui/material';
import React from 'react';
import { format } from 'date-fns';
import { convertToDate, isBeforeDateTime } from '../../../../../functions/utils/dateTimeUtils';
import { ja } from 'date-fns/locale';
import TaskDetailHeading from './TaskDetailHeading';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { detailBoxStyle } from '../../shared/constants/problemSets/problemSetsConstants';
import { formatDateDifference } from '../../../../../functions/utils/timeFormatUtils';

interface TaskDetailsProps {
  task: TaskData;
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
      <TaskDetailHeading task={task} sx={detailBoxStyle} />
      <Box sx={detailBoxStyle}>
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
      <Box sx={detailBoxStyle}>
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