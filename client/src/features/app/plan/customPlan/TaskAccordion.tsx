// TaskAccordion.tsx
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import RangeNumbersDisplay from '../../task/shared/components/RangeNumbersDisplay';
import SnackbarForRangeSelection from '../../task/shared/components/SnackbarForRangeSelection';
import { formatDueDateTime } from '../../task/shared/utils/taskUtils';
import { getId } from '../shared/utils/plan/customPlanUtils';

interface TaskAccordionProps {
  task: TaskData;
  getNumberColor: (id: string, num: number) => string;
  onSelectNumber: (id: string, num: number) => void;
  getState: (id: string) => any;
  onCancelSelection: (id: string) => void;
  onDeleteOperatingRange: (id: string) => void;
}

const TaskAccordion: React.FC<TaskAccordionProps> = ({
  task,
  getNumberColor,
  onSelectNumber,
  getState,
  onCancelSelection,
  onDeleteOperatingRange,
}) => {
  const formatDeadline = task.dueDateTime ? formatDueDateTime(task.dueDateTime) : null;

  if (task.completed || !task.problemSetActivityField) return null;

  return (
    <Accordion sx={{ my: 0.5 }}>
      <AccordionSummary><Typography>{task.title} {formatDeadline}</Typography></AccordionSummary>
      <AccordionDetails>
        {task.problemSetActivityField.activityStatus.map((status) => {
          const id = getId(task.taskId, status.categoryId);
          return (
            <Box key={id} >
              <Typography>{status.categoryName}</Typography>
              <RangeNumbersDisplay
                numbers={status.remainingProblemIds}
                handleSelectColor={(num) => getNumberColor(id, num)}
                onClickNumber={(num) => onSelectNumber(id, num)}
              />
              <SnackbarForRangeSelection
                categoryName={status.categoryName}
                state={getState(id)}
                onCancelSelection={() => onCancelSelection(id)}
                onDeleteOperatingRange={() => onDeleteOperatingRange(id)}
              />
            </Box>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default TaskAccordion;
