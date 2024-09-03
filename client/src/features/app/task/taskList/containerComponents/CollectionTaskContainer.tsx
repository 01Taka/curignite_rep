import React, { FC } from 'react';
import OverViewInfo from './OverViewInfo';
import { TaskCollectionBatchTaskData } from '../../../../../types/firebase/db/task/taskStructure';

export interface CollectionTaskContainerProps {
  task: TaskCollectionBatchTaskData;
  estimatedDuration: number;
}

const CollectionTaskContainer: FC<CollectionTaskContainerProps> = ({ task, estimatedDuration }) => {
  return (
    <div className="flex justify-between items-center w-36 h-12 p-2 shadow-lg rounded-lg bg-secondaryBase">
      <OverViewInfo task={task} size='sm' displayTitle={false} />
      <span className='text-xs'>推定<br/>{estimatedDuration}分</span>
    </div>
  );
}

export default CollectionTaskContainer;
