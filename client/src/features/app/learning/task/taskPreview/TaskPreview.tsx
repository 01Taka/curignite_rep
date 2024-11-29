import React from 'react';
import { Box } from '@mui/material';
import { IndividualTaskPreview, ProblemSetTaskPreviewById } from '../shared/taskPreviewTypes';

interface TaskPreviewProps {
  tasks: (IndividualTaskPreview | ProblemSetTaskPreviewById)[]
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ tasks }) => {
  return (
    <Box>
      {tasks.map(task => task.isIndividual ? (
        <Box>
          {task.title}
        </Box>
      ) : (
        <Box>
          {task.problemSetName}{task.categoryName}{task.problemId}
        </Box>
      ))}
    </Box>
  );
};

export default TaskPreview;