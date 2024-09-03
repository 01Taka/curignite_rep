import React, { FC, useEffect, useState } from 'react'
import { useAppSelector } from '../../../redux/hooks';
import serviceFactory from '../../../firebase/db/factory';
import TaskListView from '../../../features/app/task/taskList/TaskListView';
import { DocumentIdMap } from '../../../types/firebase/db/formatTypes';
import { TaskCollectionData, TaskData } from '../../../types/firebase/db/common/task/taskStructure';

const TaskList: FC = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [collectionMap, setCollectionMap] = useState<DocumentIdMap<TaskCollectionData>>({});

  useEffect(() => {
    const updateTasks = async () => {
      if (uid) {
        const taskService = serviceFactory.createUserTaskManagementService();
        const tasks = await taskService.getAllTasks(uid);
        setTasks(tasks);
      }
    }

    const updateCollectionMap = async () => {
      if (uid) {
        const collectionService = serviceFactory.createUserTaskManagementService().getTaskCollectionService();
        const collectionMap = await collectionService.getTaskCollectionMap(uid);
        setCollectionMap(collectionMap);
      }
    }

    updateTasks();
    updateCollectionMap();
  }, [uid]);

  return <TaskListView tasks={tasks} size="md"/>
}

export default TaskList