import React from 'react';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { Box, SxProps, Typography } from '@mui/material';
import ActivityRangesDisplay from './ActivityRangesDisplay';

interface TaskDetailHeadingProps {
  task: TaskData;
  sx: SxProps;
}

const TaskDetailHeading: React.FC<TaskDetailHeadingProps> = ({ task, sx }) => {
  const activityField = task.problemSetActivityField;
  if (!activityField) return null;
  return (
    <>
      <Box sx={sx} >
        <Typography>
          {task.title}
        </Typography>
        <ActivityRangesDisplay activityStatuses={activityField.activityStatus} />
      </Box>
      <Box sx={sx}>
        <Typography>
          完了率: {activityField.completionRate}
        </Typography>
        <Typography>
          推定時間: {task.formatEstDuration}
        </Typography>
      </Box>
    </>
  );
};

export default TaskDetailHeading;