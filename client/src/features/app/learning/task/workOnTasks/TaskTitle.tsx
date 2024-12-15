import React from 'react';
import { TaskPreview } from '../../shared/types/task/taskPreviewTypes';
import { Box, SxProps, Typography, TypographyProps } from '@mui/material';

interface TaskTitleProps {
  task: TaskPreview;
  fontSize?: number;
  sx?: SxProps;
  props?: TypographyProps;
}

const TaskTitle: React.FC<TaskTitleProps> = ({ task, fontSize = 1, sx, ...props }) => {
  return (
    <>
      {task.isIndividual ? (
        <Typography sx={{...sx, fontSize: `${fontSize}rem` }} {...props} >
          {task.title}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "end" }} >
            <Typography  sx={{...sx, lineHeight: 1.1, textAlign: "end", fontSize: `${fontSize}rem` }} {...props} >
              {task.problemSetName}<br />
              - {task.categoryName}
            </Typography>
          </Box>
          <Typography fontSize={`${fontSize * 2}rem`} >
            {task.problemId}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default TaskTitle;