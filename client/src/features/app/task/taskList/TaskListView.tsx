import React, { FC } from 'react'
import TaskContainer from './containerComponents/TaskContainer';
import { GradientCircleSize, TaskContainerComponentProps } from '../../../../types/app/task/taskTypes';
import { TaskData } from '../../../../types/firebase/db/common/task/taskStructure';


interface TaskListViewProps {
  tasks: TaskData[];
  ContainerComponent?: FC<TaskContainerComponentProps>; // 使用するコンテナを指定するための引数
  size: GradientCircleSize;
}

const TaskListView: FC<TaskListViewProps> = ({ tasks, ContainerComponent = TaskContainer, size }) => {  
  return (
    <>
      {tasks && tasks.map(task => {
        return (
          <ContainerComponent 
            key={task.id} 
            task={task} 
            size={size}
          />
        );
      })}
    </>
  )
}

export default TaskListView;
