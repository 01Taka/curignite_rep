import { Box, IconButton } from '@mui/material';
import React, { useMemo } from 'react';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { sortObjectArray } from '../../../../../functions/utils/dataStructureUtils/objectUtils';
import { MoreHoriz } from '@mui/icons-material';
import { commonStyles } from '../../../../../styles/mui/commonStyles';
import DaySelectButton from './DaySelectButton';
import { getModeColorByDueDateTime } from '../../shared/utils/plan/planUtils';
import TaskOverview from '../TaskOverview';

interface DaySelectButtonForProblemSetProps {
  tasks: TaskData[];
  emergencyDaysBorder: number;
  displayNumber: number;
  onSelectedDay: (task: TaskData) => void;
  isExistPlan: (task: TaskData) => boolean;
}

const DaySelectButtonForProblemSet: React.FC<DaySelectButtonForProblemSetProps> = ({ tasks, emergencyDaysBorder, displayNumber, onSelectedDay, isExistPlan }) => {
  const sortedTasks = useMemo(() => sortObjectArray(tasks, "dueDateTime"), [tasks]);
  const filterTasks = useMemo(() => sortedTasks.filter(task => !isExistPlan(task)), [sortedTasks]);

  return (
    <Box sx={{ ...commonStyles.flexColumn, gap: 1 }}>
      {filterTasks.slice(0, displayNumber).map(task => (
        <Box sx={{ ...commonStyles.flexStart, gap: 1.5 }}>
          <DaySelectButton
            task={task}
            emergencyDaysBorder={emergencyDaysBorder}
            onSelectedDay={onSelectedDay}
          />
          <TaskOverview task={task} />
        </Box>
      ))}
      {sortedTasks.length > displayNumber &&
        <IconButton
          size="small"
          sx={{
            bgcolor: getModeColorByDueDateTime(sortedTasks[displayNumber].dueDateTime, emergencyDaysBorder),
            borderRadius: 1,
            padding: 0.3,
          }}
        >
          <MoreHoriz />
        </IconButton>
      }
    </Box>
  );
};

export default DaySelectButtonForProblemSet;