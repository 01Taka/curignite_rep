import React, { FC, useEffect, useState } from 'react'
import { useAppSelector } from '../../../redux/hooks';
import { TaskCollectionBatchTaskData, TaskListIndividualTaskData, TaskListTaskCollectionData } from '../../../types/firebase/db/todo/TodoTypes';
import serviceFactory from '../../../firebase/db/factory';
import TaskListView from '../../../features/app/task/taskList/TaskListView';
import { DocumentIdMap } from '../../../types/firebase/db/formatTypes';

const TaskList: FC = () => {
  const { userData } = useAppSelector(state => state.userSlice);
  const [tasks, setTasks] = useState<(TaskListIndividualTaskData | TaskCollectionBatchTaskData)[]>([]);
  const [collectionMap, setCollectionMap] = useState<DocumentIdMap<TaskListTaskCollectionData>>({});

  useEffect(() => {
    const updateTasks = async () => {
      if (userData) {
        const taskService = serviceFactory.createTaskListService();
        const tasks = await taskService.getAllTasks(userData.metaData.taskListId);
        setTasks(tasks);
      }
    }

    const updateCollectionMap = async () => {
      if (userData) {
        const collectionService = serviceFactory.createTaskListTaskCollectionService();
        const collectionMap = await collectionService.getTaskCollectionMap(userData.metaData.taskListId);
        setCollectionMap(collectionMap);
      }
    }

    updateTasks();
    updateCollectionMap();
  }, [userData]);

  return <TaskListView tasks={tasks} taskCollectionMap={collectionMap} size="md"/>
}

export default TaskList