import { Button } from '@mui/material';
import React from 'react';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { getModeColorByDueDateTime } from '../../shared/utils/plan/planUtils';
import { formatDateDifference } from '../../../../../functions/utils/timeFormatUtils';

interface DaySelectButtonProps {
  task: TaskData;
  emergencyDaysBorder: number;
  onSelectedDay: (task: TaskData) => void;
}

const DaySelectButton: React.FC<DaySelectButtonProps> = ({ task, emergencyDaysBorder, onSelectedDay }) => {
  return (
    <Button
      variant="outlined"
      size="small"
      sx={{
        width: 50,
        height: 30,
        color: "black",
        boxShadow: 1,
        borderRadius: 1,
        bgcolor: getModeColorByDueDateTime(task.dueDateTime, emergencyDaysBorder)
      }}
      onClick={() => onSelectedDay(task)}
    >
      {task.dueDateTime ? (
        formatDateDifference(task.dueDateTime)
      ) : (
        `未定`
      )}
    </Button>
  );
};

export default DaySelectButton;
