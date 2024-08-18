import React, { FC } from 'react'
import { TaskCollectionBatchTaskData, TaskListIndividualTaskData, TaskListTaskCollectionData } from '../../../../types/firebase/db/todo/TodoTypes';
import TaskContainer from './containerComponents/TaskContainer';
import { DocumentIdMap } from '../../../../types/firebase/db/formatTypes';
import { GradientCircleSize, TaskContainerComponentProps } from '../../../../types/app/task/taskTypes';


interface TaskListViewProps {
  tasks: (TaskListIndividualTaskData | TaskCollectionBatchTaskData)[];
  taskCollectionMap: DocumentIdMap<TaskListTaskCollectionData>;
  ContainerComponent?: FC<TaskContainerComponentProps>; // 使用するコンテナを指定するための引数
  size: GradientCircleSize;
}

const TaskListView: FC<TaskListViewProps> = ({ tasks, taskCollectionMap, ContainerComponent = TaskContainer, size }) => {  
  return (
    <>
      {tasks && tasks.map(task => {
        const estimatedDuration = task.estimatedDuration || taskCollectionMap[task.collectionId]?.timePerPage || undefined;
        return (
          <ContainerComponent 
            key={task.id} 
            task={task} 
            estimatedDuration={estimatedDuration} 
            size={size}
          />
        );
      })}
    </>
  )
}

export default TaskListView;
