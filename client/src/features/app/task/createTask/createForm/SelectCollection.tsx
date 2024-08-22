import React, { FC } from 'react'
import TaskCollections from '../../../../../pages/app/task/TaskCollections'
import { TaskListTaskCollectionData } from '../../../../../types/firebase/db/todo/TodoTypes'
import { useNavigate } from 'react-router-dom'
import { replaceParams } from '../../../../../functions/path/pathUtils'
import { taskPaths } from '../../../../../types/path/mainPaths'
import { PathParam } from '../../../../../types/path/paths'

const SelectCollection: FC = () => {
  const navigate = useNavigate();

  const handleSelectCollection = (collection: TaskListTaskCollectionData) => {
    navigate(replaceParams(taskPaths.createChildren.batch, { [PathParam.CollectionId]: collection.docId }));
  }

  return (
    <>
      <TaskCollections onClickCollection={handleSelectCollection} />
    </>
  )
}

export default SelectCollection