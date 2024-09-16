// import React, { FC } from "react";
// import { CurrentSession } from "../../../../types/browserStorage/indexedDB/learningSessionsTypes";
// import { differenceInDays, differenceInMinutes } from "date-fns";
// import { Box, IconButton, Typography, CircularProgress, keyframes } from "@mui/material";
// import { convertToMilliseconds, dateTimeToString } from "../../../../functions/dateTimeUtils";
// import { saveAndFinishCurrentSession } from "../../../../services/learning/sessionActionService";
// import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import CircularButton from "../../../../components/input/button/CircularButton";
// import useAsyncHandler from "../../../hooks/useAsyncHandler";


// interface CurrentSessionDisplayProps {
//   currentSession: CurrentSession | null;
//   showSessions: boolean;
//   toggleSessions: () => void;
// }

// const CurrentSessionDisplay: FC<CurrentSessionDisplayProps> = ({
//   currentSession,
//   showSessions,
//   toggleSessions,
// }) => {
//   const format = currentSession ? (differenceInDays(currentSession.startTime, new Date()) < 1 ? 'HH:mm' : 'M/d HH:mm') : "";

//   const gradientAnimation = keyframes`
//     0% { background-position: 100% 0%; }
//     50% { background-position: 0% 0%; }
//     70% { background-position: 0% 0%; }
//     100% { background-position: -100% 0%; }
//   `;

//   const background = currentSession ? "linear-gradient(270deg, #fcd7c0, #f7904f)" : "";

//   return (
//     <Box
//       sx={{
//         background: background,
//         backgroundSize: '200% 200%',
//         animation: `${gradientAnimation} 8s ease infinite`,
//       }}
//       className="relative flex justify-around items-center w-full h-32"
//     >
//       {currentSession ? (
//         <Box className="flex justify-center items-center">
//           <Box className="flex flex-col">
//             <Box className="flex justify-between items-center">
//               <Box className="flex items-center">
//                 <Typography variant="h6" className="pr-2">現在のセッション</Typography>
//                 <IconButton onClick={toggleSessions}>
//                   {showSessions ? <ExpandLess /> : <ExpandMore />}
//                 </IconButton>
//               </Box>
//             </Box>
//             <Box className="flex">
//               <Typography variant="h6">
//                 {dateTimeToString(currentSession.startTime, { isAbsolute: true, format })}
//               </Typography>
//               <Typography variant="h6" className="px-1">~</Typography>
//               <Typography variant="h6">
//                 現在{"("}{dateTimeToString(new Date(), { isAbsolute: true, format })}{")"}
//               </Typography>
//             </Box>
//             <Box>
//               <Typography variant='h6'>
//                 {convertToMilliseconds(differenceInMinutes(new Date(), currentSession.startTime))}分継続中
//               </Typography>
//             </Box>
//           </Box>
//           <OperateSessionButtons />
//         </Box>
//       ) : (
//         <Typography variant="h6">現在のセッションはありません。</Typography>
//       )}
//       </Box>
//   );
// };

// const OperateSessionButtons: FC = React.memo(() => {
//   const { asyncStatus, callAsyncFunction } = useAsyncHandler();
//   const dispatch = useAppDispatch();
//   const uid = useAppSelector(state => state.userSlice.uid);

//   const finishCurrentSession = async () => {
//     if (!uid) return;
//     await callAsyncFunction(
//       [uid, dispatch],
//       saveAndFinishCurrentSession,
//       "セッションの終了に失敗しました。"
//     );
//   };

//   return (
//     <Box className="flex pt-1">
//       {asyncStatus === "success" ? (
//         <div className='flex justify-center items-center w-20 h-20 rounded-full bg-gray-300'>
//           終了しました
//         </div>
//       ) : (
//         <CircularButton
//           bgColor="success" 
//           size="lg" 
//           onClick={finishCurrentSession} 
//           disabled={asyncStatus === "loading"}
//           className='bg-green-500 hover:bg-green-600 shadow-md'
//         >
//           {asyncStatus === "loading" ? <CircularProgress size={24}/> : <div className="font-bold">学習を<br />終了</div>}
//         </CircularButton>
//       )}
//     </Box>
//   );
// });

// export default CurrentSessionDisplay;
export {}