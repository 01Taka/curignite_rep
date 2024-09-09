import React, { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import { TaskData } from '../../../../types/firebase/db/common/task/taskStructure';
import serviceFactory from '../../../../firebase/db/factory';
import TaskContainer from './TaskContainer';
import { GradientCircleSize } from '../../../../types/app/task/taskTypes';
import { Typography } from '@mui/material';

interface TasksProps {
  size?: GradientCircleSize;
  maxLength?: number;
}

const Tasks: FC<TasksProps> = ({ size = "md", maxLength = Infinity }) => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [tasksData, setTasksData] = useState<TaskData[]>([]);

  useEffect(() => {
    const updateTasks = async () => {
      if (uid) {
        const taskService = serviceFactory.createUserTaskManagementService();
        const tasksData = await taskService.getAllTasks(uid);
        setTasksData(truncateArray(tasksData, maxLength));
      }
    };
    updateTasks();
  }, [uid, maxLength]);  // uidが変わる時だけ実行

  function truncateArray<T>(arr: T[], maxLength: number): T[] {
    return arr.length > maxLength ? arr.slice(0, maxLength) : arr;
  }

  return (
    <div className='flex flex-col justify-center items-center w-full'>
      <div className='flex justify-center mt-8 w-full max-w-lg'>
        <Typography variant='h3'>
          タスク一覧
        </Typography>
      </div>
      {(tasksData && tasksData.length !== 0) ? (
        tasksData.map(task => (
        <div className='w-full max-w-lg' key={task.docId}>
          <TaskContainer task={task} size={size} />
        </div>
      ))) : (
        <div className='flex justify-center w-full max-w-lg mt-8'>
          <Typography variant='h4'>
            右上の「タスクを追加」から<br />
            タスクを作成してみましょう！
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Tasks;
