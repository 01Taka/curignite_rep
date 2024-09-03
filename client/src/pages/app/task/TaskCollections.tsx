import React, { FC, useEffect, useState } from 'react'
import TaskCollectionsView from '../../../features/app/task/taskCollection/TaskCollectionsView'
import serviceFactory from '../../../firebase/db/factory';
import { useAppSelector } from '../../../redux/hooks';
import { CollectionWithTasks, TaskCollectionData } from '../../../types/firebase/db/common/task/taskStructure';

interface TaskCollectionsProps {
  onClickCollection?: (taskCollection: TaskCollectionData) => void;
}

const TaskCollections: FC<TaskCollectionsProps> = ({ onClickCollection }) => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [collectionsWithTasks, setCollectionsWithTasks] = useState<CollectionWithTasks[]>([]);

  useEffect(() => {
    const updateCollectionsWithTasks = async () => {
      if (uid) {
        const collectionTaskService = serviceFactory.createUserTaskManagementService();
        const data = await collectionTaskService.getCollectionsWithTasks(uid);
        setCollectionsWithTasks(data);
      }
    }
    updateCollectionsWithTasks();
  }, [uid])

  return <TaskCollectionsView 
    collectionWithTasks={collectionsWithTasks}
    onClickCollection={onClickCollection}
  />
}

export default TaskCollections