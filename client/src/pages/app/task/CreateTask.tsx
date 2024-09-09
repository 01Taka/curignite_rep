import React, { FC } from 'react'
import TaskCollections from '../../../features/app/task/taskCollection/TaskCollections'
import CreateNavigate from '../../../features/app/task/createTask/CreateNavigate'
import Popup from '../../../components/util/Popup';
import { useNavigate } from 'react-router-dom';
import { taskPaths } from '../../../types/path/mainPaths';
import { Typography } from '@mui/material';

const CreateTask: FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(taskPaths.home);
  }
  
  return (
    <Popup open handleClose={handleClose} className='max-w-4xl'>
      <CreateNavigate />
      <div className='flex flex-col p-4 m-4 border-2 border-main rounded-lg h-auto'>
        <Typography variant='h4' className='p-2'>
          問題集一覧
        </Typography>
        <TaskCollections />
      </div>
    </Popup>
  )
}

export default CreateTask