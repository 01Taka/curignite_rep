import React, { FC } from 'react'
import TaskCollections from '../../../../../pages/app/task/TaskCollections'
import { useNavigate } from 'react-router-dom'
import { replaceParams } from '../../../../../functions/path/pathUtils'
import { taskPaths } from '../../../../../types/path/mainPaths'
import { PathParam } from '../../../../../types/path/paths'
import { TaskCollectionData } from '../../../../../types/firebase/db/common/task/taskStructure'

const SelectCollection: FC = () => {
  const navigate = useNavigate();

  const handleSelectCollection = (collection: TaskCollectionData) => {
    navigate(replaceParams(taskPaths.createChildren.batch, { [PathParam.CollectionId]: collection.docId }));
  }

  return (
    <>
      <TaskCollections onClickCollection={handleSelectCollection} />
    </>
  )
}

export default SelectCollection