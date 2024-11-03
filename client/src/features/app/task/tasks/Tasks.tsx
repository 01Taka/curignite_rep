import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import serviceFactory from '../../../../firebase/db/factory';
import TaskContainer from './TaskContainer';
import { Box } from '@mui/material';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import { TaskManagementService } from '../../../../firebase/db/util/taskManagementService';
import SimpleTaskContainer from './SimpleTaskContainer';
import ClickableContainer from '../../../../components/container/ClickableContainer';
import Popup from '../../../../components/display/popup/Popup';
import TaskDetails from './TaskDetails';

interface TasksProps {
  maxLength?: number;
}

const Tasks: React.FC<TasksProps> = ({ maxLength = Infinity }) => {
  const [showDetailTask, setShowDetailTask] = useState<TaskData | null>(null);
  const uid = useAppSelector(state => state.userSlice.uid);
  const [tasksData, setTasksData] = useState<TaskData[]>([]);

  useEffect(() => {
    const updateTasks = async () => {
      if (uid) {
        const data = await TaskManagementService.fetchAllData(serviceFactory, uid);
        setTasksData(truncateArray(data.tasks, maxLength));
      }
    };
    updateTasks();
  }, [uid, maxLength]);  // uidが変わる時だけ実行

  function truncateArray<T>(arr: T[], maxLength: number): T[] {
    return arr.length > maxLength ? arr.slice(0, maxLength) : arr;
  }

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
        {tasksData.map(task => (
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
