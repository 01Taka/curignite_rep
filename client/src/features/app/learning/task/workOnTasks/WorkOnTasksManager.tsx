import { Box, IconButton, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CurrentWorkOnTask from './CurrentWorkOnTask';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { TaskPreview } from '../../shared/types/task/taskPreviewTypes';
import useUpdateTaskCompleted from '../../shared/hooks/task/useUpdateTaskCompleted';
import { useAppSelector } from '../../../../../redux/hooks';
import { commonStyles } from '../../../../../styles/mui/commonStyles';
import TaskTitle from './TaskTitle';

interface WorkOnTasksManagerProps {
  taskPreviews: TaskPreview[];
}

const WorkOnTasksManager: React.FC<WorkOnTasksManagerProps> = ({ taskPreviews }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const userId = useAppSelector(state => state.userSlice.uid);
  const { addProblemSetTaskCompletedChanged, addIndividualTaskProgressChanged, getAdjustCompletedStateTask, confirmTaskState } = useUpdateTaskCompleted(userId, () => {});
  const tasks = useMemo(() => getAdjustCompletedStateTask(taskPreviews), [taskPreviews, getAdjustCompletedStateTask]);

  useEffect(() => {
    if (taskPreviews.length > 0) {
      const nextIndex = taskPreviews.findIndex(task => !task.isCompleted);
      setCurrentTaskIndex(nextIndex === -1 ? 0 : nextIndex);
    }
  }, [taskPreviews]);

  const incrementCurrentTaskIndex = useCallback((amount: number = 1) => {
    setCurrentTaskIndex(prevIndex => {
      const nextIndex = prevIndex + amount;
      if (0 <= nextIndex && nextIndex < taskPreviews.length) {
        return nextIndex;
      }
      return prevIndex;
    })
  }, [taskPreviews, setCurrentTaskIndex]);

  const nextTask = currentTaskIndex + 1 < tasks.length ? tasks[currentTaskIndex + 1] : null;

  return (
    <Box sx={{
      ...commonStyles.flexColumnCenter,
      width: "100%",
      gap: '0.5rem',
    }}>
      <Box sx={{ display: "flex", gap: 0.5, width: "90%" }}>
        <Typography variant="caption" >次のタスク: </Typography>
        {nextTask &&
          <TaskTitle task={nextTask} variant="caption" />
        }
      </Box>
      <CurrentWorkOnTask
        currentTask={tasks[currentTaskIndex] ?? null}
        onSetProblemSetTaskCompleted={addProblemSetTaskCompletedChanged}
        onSetIndividualProgress={addIndividualTaskProgressChanged}
      />
      <Box sx={{ ...commonStyles.flexBetween, width: "100%" }}>
        <IconButton size='large' onClick={() => incrementCurrentTaskIndex(-1)}>
          <ArrowBackIosNew />
        </IconButton>
        <IconButton size='large' onClick={() => incrementCurrentTaskIndex(1)}>
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
};

export default WorkOnTasksManager;