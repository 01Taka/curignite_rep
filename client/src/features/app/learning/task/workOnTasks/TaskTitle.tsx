import React from 'react';
import { TaskPreview } from '../../shared/types/task/taskPreviewTypes';
import { SxProps, Typography, TypographyProps, TypographyVariant } from '@mui/material';

interface TaskTitleProps {
  task: TaskPreview;
  sx?: SxProps;
  props?: TypographyProps;
  variant?: TypographyVariant
}

const TaskTitle: React.FC<TaskTitleProps> = ({ task, sx, variant, ...props }) => {
  return (
    <>
      {task.isIndividual ? (
        <Typography sx={sx} variant={variant} {...props} >
          {task.title}
        </Typography>
      ) : (
        <Typography  sx={sx} variant={variant} {...props} >
          {task.problemSetName} - {task.categoryName} {task.problemId}
        </Typography>
      )}
    </>
  );
};

export default TaskTitle;