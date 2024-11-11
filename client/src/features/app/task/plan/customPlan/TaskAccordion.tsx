// TaskAccordion.tsx
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import RangeNumbersDisplay from '../../util/RangeNumbersDisplay';
import SnackbarForRangeSelection from '../../util/SnackbarForRangeSelection';
import { formatDueDateTime, getId } from './shared/customPlanUtils';

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
    <Accordion>
      <AccordionSummary><Typography>{task.title} {formatDeadline}</Typography></AccordionSummary>
      <AccordionDetails>
        {task.problemSetActivityField.activityStatus.map((status) => {
          const id = getId(task.docId, status.categoryId);
          return (
            <Box key={id} sx={{ ml: 2 }}>
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
