import React, { FC } from 'react'
import TaskCollections from '../../taskCollection/TaskCollections'
import { useNavigate } from 'react-router-dom'
import { replaceParams } from '../../../../../functions/path/pathUtils'
import { taskPaths } from '../../../../../types/path/mainPaths'
import { PathParam } from '../../../../../types/path/paths'
import { TaskCollectionData } from '../../../../../types/firebase/db/common/task/taskStructure'
import { Typography } from '@mui/material'

const SelectCollection: FC = () => {
  const navigate = useNavigate();

  const handleSelectCollection = (collection: TaskCollectionData) => {
    navigate(replaceParams(taskPaths.createChildren.batch, { [PathParam.CollectionId]: collection.docId }));
  }

  return (
    <div className='flex flex-col items-center'>
      <Typography variant='h5' className='py-4'>
        タスクを追加する問題集を選択
      </Typography>
      <div>
        <TaskCollections onClickCollection={handleSelectCollection} />
      </div>
    </div>
  )
}

export default SelectCollection