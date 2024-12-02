import React, { useMemo, useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import { Box } from '@mui/material';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import SimpleTaskContainer from './SimpleTaskContainer';
import ClickableContainer from '../../../../components/container/ClickableContainer';
import Popup from '../../../../components/display/popup/Popup';
import TaskDetails from './details/TaskDetails';
import { dynamicStyles } from '../../../../styles/mui/dynamicStyles';
import { sortByDueDateTime } from '../shared/utils/taskUtils';

interface TasksProps {}

const Tasks: React.FC<TasksProps> = () => {
  const [showDetailTask, setShowDetailTask] = useState<TaskData | null>(null);
  const { taskMap } = useAppSelector(state => state.taskSlice);
  const tasks = useMemo(() => Object.values(taskMap), [taskMap]);
  const sortedTasks = useMemo(() => sortByDueDateTime(tasks, "dueDateTime"), [taskMap]) as TaskData[];

  return (
    <>
      <Box sx={{
        ...dynamicStyles.grid(),
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        marginX: 1
      }}>
        {sortedTasks.map(task => (
          <ClickableContainer key={task.taskId} onClick={() => setShowDetailTask(task)}>
            <SimpleTaskContainer task={task} />
          </ClickableContainer>
        ))}
      </Box>
      <Popup open={!!showDetailTask} handleClose={() => setShowDetailTask(null)}>
        {showDetailTask && <TaskDetails task={showDetailTask}/>}
      </Popup>
    </>
  );
};

export default Tasks;
