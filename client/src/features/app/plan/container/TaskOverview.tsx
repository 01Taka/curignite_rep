import { Typography } from '@mui/material';
import React from 'react';
import { timeOmissionFormat } from '../../../../functions/utils/timeFormatUtils';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';

interface TaskOverviewProps {
  task: TaskData;
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ task }) => {
  return (
    <>
      <Typography>
        {task.isIndividual ? (
          `${task.progress}%`
        ) : (
          `${task.problemSetActivityField.completionRate}`
        )}
      </Typography>
      <Typography>
        推定{timeOmissionFormat(task.remainingEstimatedDuration)}
      </Typography>
    </>
  );
};

export default TaskOverview;