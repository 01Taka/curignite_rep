// import React, { FC, useEffect, useState, useCallback } from 'react';
// import { IndexedLearningSessionService } from '../../../../functions/browserStorage/indexedDB/services/indexedLearningSessionService';
// import { Session } from '../../../../types/browserStorage/indexedDB/learningSessionsTypes';
// import { Typography, Box, CircularProgress, Divider, Collapse } from '@mui/material';
// import { convertToMilliseconds, dateTimeToString } from '../../../../functions/dateTimeUtils';
// import { differenceInDays, differenceInMinutes } from 'date-fns';
// import { SECONDS_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';
// import { useAppSelector } from '../../../../redux/hooks';
// import CurrentSessionDisplay from './CurrentSessionDisplay';

// const LearningSessions: FC = () => {
//   const uid = useAppSelector(state => state.userSlice.uid);
//   const currentSession = useAppSelector(state => state.sessionSlice.currentSession);
//   const [sessions, setSessions] = useState<Session[] | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [showSessions, setShowSessions] = useState<boolean>(false);

//   const fetchSessions = useCallback(async () => {
//     if (!uid) return;
//     try {
//       const allSessions = await IndexedLearningSessionService.getAllSessions(uid);
//       setSessions(allSessions);
//     } catch (error) {
//       console.error("Failed to fetch learning sessions:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [uid]);

//   useEffect(() => {
//     fetchSessions();

//     const intervalId = setInterval(fetchSessions, 20 * SECONDS_IN_MILLISECOND);
//     return () => clearInterval(intervalId);
//   }, [fetchSessions]);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box className="shadow-md rounded-lg w-96 max-h-48 overflow-y-auto">
//       <CurrentSessionDisplay
//         currentSession={currentSession}
//         showSessions={showSessions}
//         toggleSessions={() => setShowSessions(prev => !prev)}
//       />
//       <Collapse in={showSessions}>
//         <Divider className='pt-1' />
//         <Sessions sessions={sessions} />
//       </Collapse>
//     </Box>
//   );
// };

// interface SessionsProps {
//   sessions: Session[] | null;
// }

// const Sessions: FC<SessionsProps> = React.memo(({ sessions }) => {
//   if (!sessions || sessions.length === 0) {
//     return <Typography variant="body1">セッションがありません。</Typography>;
//   }

//   return (
//     <Box className="pt-1">
//       <Typography variant='h6'>今日のセッション</Typography>
//       {sessions.map(session => {
//         const format = differenceInDays(session.endTime, session.startTime) < 1 ? 'HH:mm' : 'M/d HH:mm';
//         return (
//           <Box key={session.id} className="flex p-1">
//             <Typography variant="body1">
//               {dateTimeToString(session.startTime, { isAbsolute: true, format })}
//             </Typography>
//             <Typography variant="body1" className="px-1">~</Typography>
//             <Typography variant="body1">
//               {dateTimeToString(session.endTime, { isAbsolute: true, format })}
//             </Typography>
//             <Box className="ml-auto">
//               <Typography>
//                 {convertToMilliseconds(differenceInMinutes(session.endTime, session.startTime))}分継続
//               </Typography>
//             </Box>
//           </Box>
//         );
//       })}
//     </Box>
//   );
// });




// export default LearningSessions;
export {}