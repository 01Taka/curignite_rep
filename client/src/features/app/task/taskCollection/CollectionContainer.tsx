import React, { FC } from 'react'
import { TaskCollectionBatchTaskData, TaskListTaskCollectionData } from '../../../../types/firebase/db/todo/TodoTypes'
import { Divider, Typography } from '@mui/material';
import CollectionTaskView from '../taskList/CollectionTaskView';
import { MINUTES_IN_MILLISECOND } from '../../../../types/util/dateTimeTypes';
import { cn } from '../../../../functions/utils';

interface CollectionContainerProps {
  taskCollection: TaskListTaskCollectionData;
  batchTasks: TaskCollectionBatchTaskData[];
  onClickCollection: (taskCollection: TaskListTaskCollectionData) => void;
}

const CollectionContainer: FC<CollectionContainerProps> = ({ taskCollection, batchTasks, onClickCollection }) => {
  return (
    <div className='w-full h-full p-2 border-gray-400 border-2 rounded-lg flex flex-col' onClick={() => onClickCollection(taskCollection)}>
      <div className={cn('flex-grow overflow-y-auto min-h-10', taskCollection.description ? "max-h-16" : "max-h-10")}>
        <Typography variant='h6'>
          {taskCollection.name}
        </Typography>
        <Typography>
          {taskCollection.description}
        </Typography>
      </div>
      <Divider />
      <div className='flex flex-col m-2'>
        <span>1P推定: {taskCollection.timePerPage / MINUTES_IN_MILLISECOND}分</span>
        <span>{taskCollection.completedPageIndices.length}/{taskCollection.totalPages} 完了</span>
      </div>
      <Divider />
      <div className='flex flex-col flex-grow items-center overflow-y-auto overflow-x-hidden space-y-2 m-2'>
        <CollectionTaskView tasks={batchTasks} collection={taskCollection} />
      </div>
    </div>
  )
}

export default CollectionContainer
