import React, { FC } from 'react'
import CircularButton from '../../../../components/input/button/CircularButton'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { mainPaths } from '../../../../types/path/mainPaths'

const TaskPageLink: FC = () => {
  const navigate = useNavigate();

  return (
    <div className='p-4 mt-4 shadow-md flex'>
      <div className='flex flex-col'>
        <Typography variant='h5'>
          学習計画を立てる
        </Typography>
        <Typography>
          手軽に宿題などの管理ができます。
        </Typography>
      </div>
      <CircularButton size="xl" bgColor="main" onClick={() => navigate(mainPaths.task)}>
        学習計画
      </CircularButton>
    </div>
  )
}

export default TaskPageLink