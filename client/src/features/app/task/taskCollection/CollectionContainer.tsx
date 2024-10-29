// import React, { FC } from 'react'
// import { Divider, Typography } from '@mui/material';
// import CollectionTaskView from './CollectionTaskView';
// import { cn } from '../../../../functions/utils';
// import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';
// import { ExpansionProblemSetData, TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';

// interface CollectionContainerProps {
//   problemSet: ExpansionProblemSetData;
//   activities: TaskData[];
//   onClickProblemSet: (problemSet: ExpansionProblemSetData) => void;
// }

// const CollectionContainer: FC<CollectionContainerProps> = ({ problemSet, activities, onClickProblemSet }) => {
//   return (
//     <div className='w-full h-full p-2 border-gray-400 border-2 rounded-lg flex flex-col' onClick={() => onClickProblemSet(problemSet)}>
//       <div className={cn('flex-grow overflow-y-auto min-h-10', problemSet.description ? "max-h-16" : "max-h-10")}>
//         <Typography variant='h6'>
//           {problemSet.name}
//         </Typography>
//         <Typography>
//           {problemSet.description}
//         </Typography>
//       </div>
//       <Divider />
//       <div className='flex flex-col m-2'>
//         <span>1P推定: {problemSet.averageEstimatedDuration / MINUTES_IN_MILLISECOND}分</span>
//         <span>{problemSet.completedProblemNumber}/{problemSet.totalProblemNumber} 完了</span>
//       </div>
//       <Divider />
//       <div className='flex flex-col flex-grow items-center overflow-y-auto overflow-x-hidden space-y-2 m-2'>
//         <CollectionTaskView tasks={collectionTasks} collection={taskCollection} />
//       </div>
//     </div>
//   )
// }

// export default CollectionContainer
export {}