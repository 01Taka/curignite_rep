import React, { FC } from 'react'
import CollectionContainer from './CollectionContainer';
import { CollectionWithTasks, TaskCollectionData } from '../../../../types/firebase/db/common/task/taskStructure';

interface TaskCollectionsViewProps {
  collectionWithTasks: CollectionWithTasks[];
  onClickCollection?: (taskCollection: TaskCollectionData) => void;
}

const TaskCollectionsView: FC<TaskCollectionsViewProps> = ({ collectionWithTasks, onClickCollection = () => {} }) => {
  return (
    <div className='flex flex-wrap justify-center gap-4'>
      {collectionWithTasks && collectionWithTasks.map((data) => (
        <div key={data.collectionData.docId} className='w-44 h-64'>
          <CollectionContainer
            taskCollection={data.collectionData}
            collectionTasks={data.tasksInCollection}
            onClickCollection={onClickCollection}
          />
        </div>
      ))}
    </div>
  )
}

export default TaskCollectionsView
