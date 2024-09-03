import React, { FC } from 'react';
import { TaskCollectionBatchTaskData, TaskListTaskCollectionData } from '../../../../types/firebase/db/task/taskStructure';
import CollectionTaskContainer from './containerComponents/CollectionTaskContainer';

interface CollectionTaskViewProps {
  tasks: TaskCollectionBatchTaskData[];
  collection: TaskListTaskCollectionData;
}

const calculateEstimatedDuration = (task: TaskCollectionBatchTaskData, collection: TaskListTaskCollectionData) => {
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
