import { Box, Divider } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CurrentWorkOnTask from './CurrentWorkOnTask';
import { TaskPreview } from '../../shared/types/task/taskPreviewTypes';
import useUpdateTaskCompleted from '../../shared/hooks/task/useUpdateTaskCompleted';
import { useAppSelector } from '../../../../../redux/hooks';
import { commonStyles } from '../../../../../styles/mui/commonStyles';
import TaskSwitchNavigation from './TaskSwitchNavigation';

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
      width: "90%",
      mx: "auto",
      gap: '0.5rem',
      boxShadow: 2,
      borderRadius: 2,
      padding: 0.5,
    }}>
      <CurrentWorkOnTask
        currentTask={tasks[currentTaskIndex] ?? null}
        onSetProblemSetTaskCompleted={addProblemSetTaskCompletedChanged}
        onSetIndividualProgress={addIndividualTaskProgressChanged}
      />
      <Divider sx={{ width: "100%" }} />
      <TaskSwitchNavigation nextTask={nextTask} incrementCurrentTaskIndex={incrementCurrentTaskIndex} />
    </Box>
  );
};

export default WorkOnTasksManager;