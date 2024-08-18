// import React, { FC } from 'react';
// import { TaskCollectionBatchTaskData } from '../../../../types/firebase/db/todo/TodoTypes';
// import { sortArray } from '../../../../functions/objectUtils';
// import TaskContainer from '../taskList/containerComponents/TaskContainer';

// interface BatchTasksOverviewProps {
//   batchTasks: TaskCollectionBatchTaskData[];
//   timePerPage: number;
// }

// const BatchTasksOverview: FC<BatchTasksOverviewProps> = ({ batchTasks, timePerPage }) => {
//   const sortedBatchTasks = sortArray(batchTasks, 'dueDateTime');

//   return (
//     <div>
//       {sortedBatchTasks.map(task => (
//         <TaskContainer
//           key={task.id}
//           task={task}
//           estimatedDuration={timePerPage * (task.pagesInRange.length - task.completedPages.length)}
//           size='sm'
//         />
//       ))}
//     </div>
//   );
// };

// export default BatchTasksOverview;
export {}