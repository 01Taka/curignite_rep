import React, { FC } from 'react'
import { Divider, Typography } from '@mui/material';
import CollectionTaskView from '../taskList/CollectionTaskView';
import { cn } from '../../../../functions/utils';
import { TaskCollectionData, TaskCollectionTaskData } from '../../../../types/firebase/db/common/task/taskStructure';
import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';

interface CollectionContainerProps {
  taskCollection: TaskCollectionData;
  collectionTasks: TaskCollectionTaskData[];
  onClickCollection: (taskCollection: TaskCollectionData) => void;
}

const CollectionContainer: FC<CollectionContainerProps> = ({ taskCollection, collectionTasks, onClickCollection }) => {
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
        <CollectionTaskView tasks={collectionTasks} collection={taskCollection} />
      </div>
    </div>
  )
}

export default CollectionContainer
