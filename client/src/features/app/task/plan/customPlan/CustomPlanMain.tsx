// CustomPlanMain.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import TaskCheckbox from './TaskCheckbox';
import TaskAccordion from './TaskAccordion';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { TodayTasks } from '../../shared/types/plan/planTypes';
import { ProblemSetCategoryRead } from '../../../../../types/firebase/db/task/taskStructure';
import useCustomPlan from '../../shared/hooks/plan/useCustomPlan';
import { millToMin } from '../../shared/utils/taskUtils';

interface CustomPlanProps {
  studyTimeNeededToday: number;
  recommendTask: TodayTasks | null;
  tasks: TaskData[];
  categoryMap: Record<string, ProblemSetCategoryRead>;
  createTaskPlan: (todayTasks: TodayTasks) => void;
}

const CustomPlanMain: React.FC<CustomPlanProps> = ({ studyTimeNeededToday, recommendTask, tasks, createTaskPlan }) => {
  const {
    todayPlanTasks,
    todayIndividualTasks,
    addIndividualTask,
    removeIndividualTask,
    getNumberColor,
    onSelectNumber,
    getState,
    onCancelSelection,
    onDeleteOperatingRange,
  } = useCustomPlan(tasks, recommendTask ?? undefined);

  return (
    <Box sx={{ bgcolor: 'ghostwhite', pt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant='h6'>合計 / 目標</Typography>
        <Typography variant='h5'>{millToMin(todayPlanTasks.estimatedDuration)}分 / {millToMin(studyTimeNeededToday)}分</Typography>
      </Box>
      <Box sx={{ padding: 2 }} >
        {tasks.map((task) => (
          <TaskCheckbox
            key={task.taskId}
            task={task}
            todayTask={todayIndividualTasks[task.taskId]}
            onChangeState={(checked, percent) => checked ? addIndividualTask(task, percent) : removeIndividualTask(task.taskId)}
          />
        ))}
      </Box>
      <Box sx={{ padding: 1 }} >
        {tasks.map((task) => (
          <TaskAccordion
            key={task.taskId}
            task={task}
            getNumberColor={getNumberColor}
            onSelectNumber={onSelectNumber}
            getState={getState}
            onCancelSelection={onCancelSelection}
            onDeleteOperatingRange={onDeleteOperatingRange}
          />
        ))}
      </Box>
      <Button variant='contained' onClick={() => createTaskPlan(todayPlanTasks)} >
        決定
      </Button>
      <Box height={300} />
    </Box>
  );
};

export default CustomPlanMain;
