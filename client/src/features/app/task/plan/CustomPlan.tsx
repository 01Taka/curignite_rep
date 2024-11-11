// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
// import { Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
// import { format } from 'date-fns';
// import { convertToDate } from '../../../../functions/utils/dateTimeUtils';
// import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';
// import useMultipleRangeSelections from '../../../hooks/range/useMultipleRangeSelections';
// import RangeSelector from '../util/RangeSelector';
// import RangeNumbersDisplay from '../util/RangeNumbersDisplay';
// import useLog from '../../../hooks/useLog';
// import { sumRanges } from '../../../../functions/utils/rangeUtils';
// import { ProblemSetCategoryData } from '../../../../types/firebase/db/task/taskStructure';
// import SnackbarForRangeSelection from '../util/SnackbarForRangeSelection';
// import { TimeTypes } from '../../../../types/util/dateTimeTypes';

// interface CustomPlanProps {
//   studyTimeNeededToday: number;
//   tasks: TaskData[];
// }

// const CustomPlan: React.FC<CustomPlanProps> = ({ studyTimeNeededToday, tasks }) => {
//   const [selectedTaskTime, setSelectedTaskTime] = useState<Record<string, number>>({});

//   const { totalState, addRangeSelections, getNumberColor, onSelectNumber, getState, onCancelSelection, onDeleteOperatingRange } = useMultipleRangeSelections();

//   const categoryMap: Record<string, ProblemSetCategoryData> = useMemo(() => {
//     return tasks.reduce((acc, task) => {
//       return Object.assign(acc, task.problemSetActivityField?.categoryMap ?? {})
//     }, {})
//   }, [tasks])

//   const getId = (taskId: string, categoryId: string) => {
//     return `${taskId}/${categoryId}`
//   }

//   const recoveryId = (id: string) => {
//     const regex = /^([^/]+)\/([^/]+)$/;

//     const match = id.match(regex);
//     if (match) {
//       const taskId = match[1];
//       const categoryId = match[2];
//       return { taskId, categoryId }
//     } else {
//       return { taskId: '', categoryId: '' }
//     }
//   }

//   useEffect(() => {
//     totalState.map(state => {
//       const { categoryId } = recoveryId(state.id);
//       const problemNumber = sumRanges(state.selectedRanges);
//       const time = problemNumber * categoryMap[categoryId].timePerProblem;

//       setSelectedTaskTime(prev => ({
//         ...prev,
//         [state.id]: time
//       }))
//     })
//   }, [totalState, categoryMap]);

//   const ids = useMemo(() => {
//     const ids = tasks.map(task => {
//       if (!task.problemSetActivityField) {
//         return null;
//       }
//       return Object.keys(task.problemSetActivityField.categoryMap).map(categoryId => getId(task.docId, categoryId));
//     })
//     return ids.filter(id => id !== null).flat() as string[];
//   }, [tasks])

//   useEffect(() => {
//     // IDsを一括で処理できるように変更
//     if (ids.length > 0) {
//       addRangeSelections(ids);
//     }
//   }, [tasks, addRangeSelections]);
  
//   const totalTime = useMemo(() => {
//     return Object.values(selectedTaskTime).reduce((sum, time) => sum + time, 0);
//   }, [selectedTaskTime])

//   const setTaskTime = (id: string, estimatedDuration: number) => {
//     setSelectedTaskTime(prev => ({
//       ...prev,
//       [id]: estimatedDuration
//     }));
//   };

//   const removeTask = (id: string) => {
//     setSelectedTaskTime(prev => {
//       const { [id]: _, ...rest } = prev; // 該当IDを削除
//       return rest;
//     });
//   };

//   const millToMin = useCallback((mill: number) => {
//     return Math.ceil(mill / MINUTES_IN_MILLISECOND);
//   }, []);

//   const formatDueDateTime = useCallback((dueDateTime: TimeTypes | null) => {
//     return dueDateTime 
//     ? format(convertToDate(dueDateTime), 'MM/dd') 
//     : null;
//   }, [])
  
//   const handleCheckbox = useCallback((event: React.ChangeEvent<HTMLInputElement>, id: string, estimatedDuration: number) => {
//     event.target.checked
//     ? setTaskTime(id, estimatedDuration)
//     : removeTask(id)
//   }, [])

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//         <Typography variant='h6'>
//           合計 / 目標
//         </Typography>
//         <Typography variant='h5'>
//           {millToMin(totalTime)}分 / {millToMin(studyTimeNeededToday)}分
//         </Typography>
//       </Box>
//       <Box>
//         {tasks.map((task) => {
//           if (!task.isIndividual || task.completed) return null;
          
//           const isChecked = selectedTaskTime[task.docId] > 0;
//           const formatDeadline = formatDueDateTime(task.dueDateTime);

//           return (
//             <Box key={task.docId} sx={{ mb: 2 }}>
//               <FormControlLabel 
//                 control={
//                   <Checkbox 
//                     checked={isChecked} 
//                     onChange={(e) => handleCheckbox(e, task.docId, task.estimatedDuration)} 
//                   />
//                 } 
//                 label={task.title} 
//               />
//               {formatDeadline && (
//                 <Typography variant="body2" color="textSecondary">
//                   締切日: {formatDeadline}
//                 </Typography>
//               )}
//               <Typography variant="body2" color="textSecondary">
//                 推定 {millToMin(task.estimatedDuration)} 分
//               </Typography>
//             </Box>
//           );
//         })}
//       </Box>
//       <Box>
//         {tasks.map((task, index) => {
//           const activityField = task.problemSetActivityField;
//           if (task.completed || !activityField) return null;
//           const formatDeadline = formatDueDateTime(task.dueDateTime);

//           return (
//             <Accordion key={index} >
//               <AccordionSummary>
//                 <Typography>
//                   {task.title} {formatDeadline}
//                 </Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 {activityField.activityStatus.map(status => {
//                   const id = getId(task.docId, status.categoryId);
//                   return (
//                     <Box sx={{ ml: 2 }} >
//                       <Typography>
//                         {status.categoryName}
//                       </Typography>
//                       <RangeNumbersDisplay
//                         numbers={status.remainingProblemIds}
//                         handleSelectColor={(num) => getNumberColor(id, num)}
//                         onClickNumber={(num) => onSelectNumber(id, num)}
//                       />
//                       <SnackbarForRangeSelection
//                         categoryName={status.categoryName}
//                         state={getState(id)}
//                         onCancelSelection={() => onCancelSelection(id)}
//                         onDeleteOperatingRange={() => onDeleteOperatingRange(id)}
//                       />
//                     </Box>
//                   )
//                 })}
//               </AccordionDetails>
//             </Accordion>
//           )
//         })}
//       </Box>
//       <Box height={300} />
//     </Box>
//   );
// };

// export default CustomPlan;

export {}