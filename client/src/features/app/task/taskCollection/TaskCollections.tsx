import React, { FC, useCallback, useEffect, useState } from 'react';
import TaskCollectionsView from './TaskCollectionsView';
import serviceFactory from '../../../../firebase/db/factory';
import { useAppSelector } from '../../../../redux/hooks';
import { CollectionWithTasksData, TaskCollectionData } from '../../../../types/firebase/db/common/task/taskStructure';

interface TaskCollectionsProps {
  onClickCollection?: (taskCollection: TaskCollectionData) => void;
}

const TaskCollections: FC<TaskCollectionsProps> = ({ onClickCollection }) => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [collectionsWithTasks, setCollectionsWithTasks] = useState<CollectionWithTasksData[]>([]);

  // 非同期でコレクションとタスクを取得する関数
  const fetchCollectionsWithTasks = useCallback(async () => {
    if (uid) {
      const collectionTaskService = serviceFactory.createUserTaskManagementService();
      const data = await collectionTaskService.getCollectionsWithTasksData(uid);
      setCollectionsWithTasks(data);
    }
  }, [uid])

  useEffect(() => {
    fetchCollectionsWithTasks();
  }, [fetchCollectionsWithTasks]);

  return (
    <TaskCollectionsView
      collectionWithTasks={collectionsWithTasks}
      onClickCollection={onClickCollection}
    />
  );
};

export default TaskCollections;
