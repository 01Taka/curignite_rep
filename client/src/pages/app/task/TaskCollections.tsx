import React, { FC, useEffect, useState } from 'react'
import TaskCollectionsView from '../../../features/app/task/taskCollection/TaskCollectionsView'
import serviceFactory from '../../../firebase/db/factory';
import { useAppSelector } from '../../../redux/hooks';
import { TaskCollectionBatchTaskData, TaskListTaskCollectionData } from '../../../types/firebase/db/task/taskStructure';
import { DocumentIdMap } from '../../../types/firebase/db/formatTypes';

interface TaskCollectionsProps {
  onClickCollection?: (taskCollection: TaskListTaskCollectionData) => void;
}

const TaskCollections: FC<TaskCollectionsProps> = ({ onClickCollection }) => {
  const { userData } = useAppSelector(state => state.userSlice);
  const [collections, setCollections] = useState<TaskListTaskCollectionData[]>([]);
  const [batchTaskMapByCollectionId, setBatchTaskMapByCollectionId] = useState<DocumentIdMap<TaskCollectionBatchTaskData[]>>({});

  useEffect(() => {
    const updateCollections = async () => {
      if (userData) {
        const collectionService = serviceFactory.createTaskListTaskCollectionService();
        const collections = await collectionService.getAllCollections(userData.metaData.taskListId);
        setCollections(collections);
      }
    }

    const updateMap = async () => {
      if (userData) {
        const batchTaskService = serviceFactory.createTaskCollectionBatchTaskService();
        const tasks = await batchTaskService.getBatchTaskMapByCollectionId(userData.metaData.taskListId);
        setBatchTaskMapByCollectionId(tasks);
      }
    }

    updateCollections();
    updateMap();
  }, [userData])

  return <TaskCollectionsView 
    taskCollections={collections}
    batchTaskMapByCollectionId={batchTaskMapByCollectionId}
    onClickCollection={onClickCollection}
  />
}

export default TaskCollections