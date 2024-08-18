import React, { FC } from 'react'
import TaskList from './TaskList'
import CircularButton from '../../../components/input/button/CircularButton'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { taskPaths } from '../../../types/path/mainPaths'
import { getLastSegment } from '../../../functions/path/pathUtils'
import CreateTask from './CreateTask'

const TaskHome: FC = () => {
  const navigate = useNavigate();
  const toCreate = () => {
    navigate(taskPaths.create);
  }

  return (
    <>
      <div className='relative h-full w-full'>
        <div className='fixed right-4 top-4'>
          <CircularButton bgColor="main" size="lg" onClick={toCreate}>
            タスク<br/>追加
          </CircularButton>
        </div>
        <TaskList />
      </div>
      <Routes>
        <Route path={getLastSegment(taskPaths.create, true)} element={<CreateTask />} />
      </Routes>
    </>
  )
}

export default TaskHome
