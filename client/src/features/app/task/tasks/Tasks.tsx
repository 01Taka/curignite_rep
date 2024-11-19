import React, { useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import { Box } from '@mui/material';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import SimpleTaskContainer from './SimpleTaskContainer';
import ClickableContainer from '../../../../components/container/ClickableContainer';
import Popup from '../../../../components/display/popup/Popup';
import TaskDetails from './TaskDetails';

interface TasksProps {

}

const Tasks: React.FC<TasksProps> = () => {
  const [showDetailTask, setShowDetailTask] = useState<TaskData | null>(null);
  const tasks = useAppSelector(state => state.taskSlice.tasks);

  return (
    <>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 1,
        marginX: 1
      }}>
        {tasks.map(task => (
          <ClickableContainer key={task.docId} onClick={() => setShowDetailTask(task)}>
            <SimpleTaskContainer task={task} />
          </ClickableContainer>
        ))}
      </Box>
      <Popup open={!!showDetailTask} handleClose={() => setShowDetailTask(null)} >
        {showDetailTask && <TaskDetails task={showDetailTask} />}
      </Popup>
    </>
  );
};

export default Tasks;
