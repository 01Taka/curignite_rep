import React, { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, Typography, Box, Slider } from '@mui/material';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { TodayIndividualTask } from '../../shared/types/plan/planTypes';
import { formatDueDateTime, millToMin } from '../../shared/utils/taskUtils';

interface TaskCheckboxProps {
  task: TaskData;
  todayTask: TodayIndividualTask | undefined;
  onChangeState: (checked: boolean, percent: number) => void;
}

const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ task, todayTask, onChangeState }) => {
  const [percent, setPercent] = useState(100);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (todayTask) {
      setPercent(todayTask.todayProgress * 100);
      setChecked(true);
    }
  }, [todayTask])

  if (!task.isIndividual || task.completed) return null;

  const formatDeadline = formatDueDateTime(task.dueDateTime);

  return (
    <Box sx={{ mb: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => {
              const checked = e.target.checked;
              onChangeState(checked, percent / 100);
              setChecked(checked);
            }}
          />
        }
        label={task.title}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='body2' color="textSecondary" sx={{ mr: 1 }}>
          {Math.floor(percent)}%
        </Typography>
        <Slider
          sx={{ width: '100%' }}
          value={Math.floor(percent)}
          min={task.progress * 100}
          max={100}
          step={5}
          onChange={(_, value) => setPercent(Array.isArray(value) ? 100 : value as number)}
          onChangeCommitted={() => onChangeState(checked, percent / 100)}
          size="small"
          aria-label="Progress Slider"
          valueLabelDisplay="auto"
          disabled={!checked}
        />
      </Box>
      {formatDeadline && (
        <Typography variant="body2" color="textSecondary">締切日: {formatDeadline}</Typography>
      )}
      <Typography variant="body2" color="textSecondary">
        推定 {millToMin(task.estimatedDuration)} 分
      </Typography>
    </Box>
  );
};

export default TaskCheckbox;
