import React, { FC } from 'react';
import CollectionTaskContainer from './containerComponents/CollectionTaskContainer';
import { TaskCollectionData, TaskCollectionTaskData } from '../../../../types/firebase/db/common/task/taskStructure';

interface CollectionTaskViewProps {
  tasks: TaskCollectionTaskData[];
  collection: TaskCollectionData;
}

const calculateEstimatedDuration = (task: TaskCollectionTaskData, collection: TaskCollectionData) => {
  const remainingPages = task.pagesInRange.length - collection.completedPageIndices.filter(value => task.pagesInRange.includes(value)).length;
  return remainingPages * collection.timePerPage;
};

const CollectionTaskView: FC<CollectionTaskViewProps> = ({ tasks, collection }) => {
  return (
    <>
      {tasks?.map(task => (
        <CollectionTaskContainer 
          key={task.id} 
          task={task} 
          estimatedDuration={calculateEstimatedDuration(task, collection)} 
        />
      ))}
    </>
  );
};

export default CollectionTaskView;
