// CustomPlanMain.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskCheckbox from './TaskCheckbox';
import TaskAccordion from './TaskAccordion';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import useCustomPlan from './shared/useCustomPlan';
import { millToMin } from '../shared/planUtils';

interface CustomPlanProps {
  studyTimeNeededToday: number;
  tasks: TaskData[];
}

const CustomPlanMain: React.FC<CustomPlanProps> = ({ studyTimeNeededToday, tasks }) => {
  const {
    totalTime,
    setTaskTime,
    removeTask,
    getNumberColor,
    onSelectNumber,
    getState,
    onCancelSelection,
    onDeleteOperatingRange,
  } = useCustomPlan(tasks);

  return (
    <Box sx={{ bgcolor: 'ghostwhite', pt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant='h6'>合計 / 目標</Typography>
        <Typography variant='h5'>{millToMin(totalTime)}分 / {millToMin(studyTimeNeededToday)}分</Typography>
      </Box>
      <Box sx={{ padding: 2 }} >
        {tasks.map((task) => (
          <TaskCheckbox key={task.docId} task={task} setTaskTime={setTaskTime} removeTask={removeTask} />
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
