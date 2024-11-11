// TaskCheckbox.tsx
import React from 'react';
import { Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { formatDueDateTime } from '../shared/planUtils';

interface TaskCheckboxProps {
  task: TaskData;
  setTaskTime: (id: string, estimatedDuration: number) => void;
  removeTask: (id: string) => void;
}

const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ task, setTaskTime, removeTask }) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.checked ? setTaskTime(task.docId, task.estimatedDuration) : removeTask(task.docId);
  };

  if (!task.isIndividual || task.completed) return null;
  const formatDeadline = formatDueDateTime(task.dueDateTime);

  return (
    <Box sx={{ mb: 2 }}>
      <FormControlLabel
        control={<Checkbox onChange={handleCheckboxChange} />}
        label={task.title}
      />
      {formatDeadline && (
        <Typography variant="body2" color="textSecondary">締切日: {formatDeadline}</Typography>
      )}
      <Typography variant="body2" color="textSecondary">推定 {Math.ceil(task.estimatedDuration / 60000)} 分</Typography>
    </Box>
  );
};

export default TaskCheckbox;
