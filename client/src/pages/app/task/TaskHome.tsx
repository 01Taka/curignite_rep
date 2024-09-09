import React, { FC } from 'react'
import CircularButton from '../../../components/input/button/CircularButton'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { taskPaths } from '../../../types/path/mainPaths'
import { getLastSegment } from '../../../functions/path/pathUtils'
import CreateTask from './CreateTask'
import Tasks from '../../../features/app/task/tasks/Tasks'
import { Home } from '@mui/icons-material'
import { rootPaths } from '../../../types/path/paths'

const TaskHome: FC = () => {
  const navigate = useNavigate();
  const toCreate = () => {
    navigate(taskPaths.create);
  }

  return (
    <>
      <div className='relative h-full w-full'>
        <div className='fixed right-4 top-4'>
          <CircularButton bgColor="main" size="x4l" onClick={toCreate}>
            タスクを<br/>追加
          </CircularButton>
        </div>
        <Tasks />
        <div className=' absolute top-2 left-2'>
          <CircularButton onClick={() => navigate(rootPaths.main)}>
            <Home />
          </CircularButton>
        </div>
      </div>
      <Routes>
        <Route path={getLastSegment(taskPaths.create, true)} element={<CreateTask />} />
      </Routes>
    </>
  )
}

export default TaskHome
