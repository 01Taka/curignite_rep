import React, { FC } from 'react'
import { TaskCollectionBatchTaskData, TaskListTaskCollectionData } from '../../../../types/firebase/db/todo/TodoTypes'
import CollectionContainer from './CollectionContainer';
import { DocumentIdMap } from '../../../../types/firebase/db/formatTypes';

interface TaskCollectionsViewProps {
  taskCollections: TaskListTaskCollectionData[];
  batchTaskMapByCollectionId: DocumentIdMap<TaskCollectionBatchTaskData[]>;
  onClickCollection?: (taskCollection: TaskListTaskCollectionData) => void;
}

const TaskCollectionsView: FC<TaskCollectionsViewProps> = ({ taskCollections, batchTaskMapByCollectionId, onClickCollection = () => {} }) => {
  return (
    <div className='flex flex-wrap justify-center gap-4'>
      {taskCollections && taskCollections.map((collection) => (
        <div key={collection.docId} className='w-44 h-64'>
          <CollectionContainer
            taskCollection={collection}
            batchTasks={batchTaskMapByCollectionId[collection.docId]}
            onClickCollection={onClickCollection}
          />
        </div>
      ))}
    </div>
  )
}

export default TaskCollectionsView
