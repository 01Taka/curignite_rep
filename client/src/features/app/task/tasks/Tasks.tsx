import React, { useMemo, useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import { Box } from '@mui/material';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import SimpleTaskContainer from './SimpleTaskContainer';
import ClickableContainer from '../../../../components/container/ClickableContainer';
import Popup from '../../../../components/display/popup/Popup';
import TaskDetails from './details/TaskDetails';
import { dynamicStyles } from '../../../../styles/mui/dynamicStyles';
import useLog from '../../../hooks/useLog';
import { sortTasks } from '../shared/utils/taskUtils';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { taskPaths } from '../../../../types/path/mainPaths';
import { getLastSegment } from '../../../../functions/path/pathUtils';


interface TasksProps {

}

const Tasks: React.FC<TasksProps> = () => {
  const location = useLocation();
  const param = useParams();
  const [showDetailTaskfsfaw, setShowDetailTask] = useState<TaskData | null>(null);
  const { tasks, individualTaskMap } = useAppSelector(state => state.taskSlice);
  const sortedTasks = useMemo(() => sortTasks(tasks, "dueDateTime"), [tasks]) as TaskData[];

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
          <ClickableContainer key={task.docId} onClick={() => setShowDetailTask(task)}>
            <SimpleTaskContainer task={task} />
          </ClickableContainer>
        ))}
      </Box>
      <Routes>
        <Route path={getLastSegment(taskPaths.detailPaths.individual)} element={<Sample />} />
      </Routes>
      {/* <Popup open={!!showDetailTask && location.pathname === taskPaths.createPaths.individual} handleClose={() => setShowDetailTask(null)} >
        {showDetailTask && <TaskDetails task={showDetailTask} />}
      </Popup> */}
    </>
  );
};

const Sample = () => {
  const param = useParams();
  useLog(param)
  return <Box>AAAAAAAAAAAA</Box>
}

export default Tasks;
