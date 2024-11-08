import React from 'react';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import useLog from '../../../hooks/useLog';
import usePlan from './hooks/usePlan';
import { convertToDate } from '../../../../functions/utils/dateTimeUtils';
import { HOURS_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';

interface PlanProps {
  tasks: TaskData[];
}



const Plan: React.FC<PlanProps> = ({ tasks }) => {
  const { todayTasks, studyTimeNeededToday } = usePlan(tasks, false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[].map((task, index) => ( //sortedTasks
        <TaskItem key={index} task={task} />
      ))}
    </Box>
  );
};

interface TaskItemProps {
  task: TaskData;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => (
  <Box
    sx={{
      border: '1px solid #ddd',
      borderRadius: 2,
      padding: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6">{task.title}</Typography>
      <Typography color="textSecondary">
        {task.dueDateTime ? format(convertToDate(task.dueDateTime), 'MM/dd') : '未定'}
      </Typography>
    </Box>
    {task.type === 'problemSet' && task.problems && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1 }}>
        {/* {task.problems.map(problem => (
          <Box key={problem.categoryId} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="textSecondary">{problem.categoryName}</Typography>
            <Typography>{problem.remainingProblemIds.length} 問題</Typography>
          </Box>
        ))} */}
      </Box>
    )}
  </Box>
);

export default Plan;
