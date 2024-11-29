// import React from 'react';
// import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
// import MiniValueIcon from '../../../../components/display/container/MiniValueIcon';
// import { AccessTime, Add, FormatListBulleted } from '@mui/icons-material';
// import { convertToDate, formatDateDifference, timeOmissionFormat } from '../../../../functions/utils/dateTimeUtils';
// import MultiLineText from '../../../../components/display/text/MultiLineText';
// import ActivityRangesDisplay from './submissions/ActivityRangesDisplay';
// import { ProblemSetRead } from '../../../../types/firebase/db/task/taskStructure';

// interface ProblemSetsContainerProps {
//   problemSet: ProblemSetRead;
//   activityNumber: number;
//   isOpen: boolean;
//   onCreateSubmission: () => void;
//   onClickEditTask: () => void;
//   onClickWorkOn: () => void;
//   onToggle: () => void;
// }

// interface HeaderProps {
//   problemSetName: string;
//   completedCount: number;
//   totalPages: number;
//   isOpen: boolean;
//   onToggle: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ problemSetName, completedCount, totalPages, isOpen, onToggle }) => (
//   <Box
//     sx={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       padding: 1,
//       bgcolor: '#ccc',
//       cursor: 'pointer', // クリック可能に
//       borderRadius: 2,
//       borderBottomLeftRadius: isOpen ? 0 : -2,
//       borderBottomRightRadius: isOpen ? 0 : -2,
//     }}
//     onClick={onToggle} // クリックで開閉をトグル
//   >
//     <Typography>{problemSetName}</Typography>
//     <Typography>{completedCount}/{totalPages}</Typography>
//   </Box>
// );

// // interface NextTaskDisplayProps {
// //   nextActivity: TaskData | null;
// // }

// // const NextTaskDisplay: React.FC<NextTaskDisplayProps> = ({ nextActivity }) => {
// //   // 必要なデータが存在しない場合は null を返す
// //   if (!nextActivity?.problemSetActivityField || !nextActivity.dueDateTime) {
// //     return null;
// //   }

// //   const completionRate = nextActivity.problemSetActivityField.completionRate;
// //   const formatRemainingDays = formatDateDifference(convertToDate(nextActivity.dueDateTime), '残りd日');

// //   return (
// //     <Box sx={{ display: 'flex', flexDirection: 'column', px: 1 }}>
// //       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
// //         <Typography>次のミッション</Typography>
// //         <Typography>{formatRemainingDays}</Typography>
// //       </Box>
// //       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
// //         <MultiLineText maxLines={3}>
// //           範囲: <ActivityRangesDisplay activityStatuses={nextActivity.problemSetActivityField.activityStatus}/>
// //         </MultiLineText>
// //         <Typography>
// //           {completionRate}
// //         </Typography>
// //       </Box>
// //       <Divider variant="fullWidth" />
// //     </Box>
// //   );
// // };

// const ProblemSetsContainer: React.FC<ProblemSetsContainerProps> = ({
//   problemSet,
//   activityNumber,
//   isOpen,
//   onCreateSubmission,
//   onClickEditTask,
//   onClickWorkOn,
//   onToggle,
// }) => {
//   // const formatEstimatedDuration = timeOmissionFormat(problemSet.averageEstimatedDuration);
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         bgcolor: "#eee",
//         border: 1,
//         borderColor: 'black',
//         borderRadius: 2,
//       }}
//     >
//       <Header
//         problemSetName={problemSet.name}
//         completedCount={problemSet.completedProblemNumber}
//         totalPages={problemSet.totalProblemNumber}
//         isOpen={isOpen}
//         onToggle={onToggle}
//       />
//       <NextTaskDisplay nextActivity={nextActivity}/>
//       {isOpen && (
//         <Box sx={{ padding: 1 }}>
//           <Box>
//             {formatEstimatedDuration && (
//               <Box sx={{
//                 display: 'flex',
//                 gap: 1
//               }}>
//                 {/* <MiniValueIcon icon={<AccessTime />} value={formatEstimatedDuration} tooltipText='所要時間' /> */}
//                 <MiniValueIcon icon={<FormatListBulleted />} value={activityNumber} tooltipText='ミッションの数' hide={!activityNumber} />
//               </Box>
//             )}
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
//             <IconButton color='primary' onClick={onCreateSubmission}>
//               <Add />
//             </IconButton>
//             <Button variant='outlined' onClick={onClickEditTask}>ミッション</Button>
//             <Button variant='outlined' onClick={onClickWorkOn}>始める</Button>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ProblemSetsContainer;
export {}