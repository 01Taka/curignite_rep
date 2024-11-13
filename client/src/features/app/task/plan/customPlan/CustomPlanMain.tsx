// CustomPlanMain.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskCheckbox from './TaskCheckbox';
import TaskAccordion from './TaskAccordion';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import useCustomPlan from './shared/useCustomPlan';
import { millToMin } from '../shared/planUtils';
import { TodayTasks } from '../shared/planTypes';
import useLog from '../../../../hooks/useLog';

interface CustomPlanProps {
  studyTimeNeededToday: number;
  recommendTask: TodayTasks | null;
  tasks: TaskData[];
}

const CustomPlanMain: React.FC<CustomPlanProps> = ({ studyTimeNeededToday, recommendTask, tasks }) => {
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
  } = useCustomPlan(tasks, recommendTask);

  useLog(todayPlanTasks)

  return (
    <Box sx={{ bgcolor: 'ghostwhite', pt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant='h6'>合計 / 目標</Typography>
        <Typography variant='h5'>{millToMin(todayPlanTasks.estimatedDuration)}分 / {millToMin(studyTimeNeededToday)}分</Typography>
      </Box>
      <Box sx={{ padding: 2 }} >
        {tasks.map((task) => (
          <TaskCheckbox
            key={task.docId}
            task={task}
            todayTask={todayIndividualTasks[task.docId]}
            onChangeState={(checked, percent) => checked ? addIndividualTask(task, percent) : removeIndividualTask(task.docId)}
          />
        ))}
      </Box>
      <Box sx={{ padding: 1 }} >
        {tasks.map((task) => (
          <TaskAccordion
            key={task.docId}
            task={task}
            getNumberColor={getNumberColor}
            onSelectNumber={onSelectNumber}
            getState={getState}
            onCancelSelection={onCancelSelection}
            onDeleteOperatingRange={onDeleteOperatingRange}
          />
        ))}
      </Box>
      <Box height={300} />
    </Box>
  );
};

export default CustomPlanMain;
