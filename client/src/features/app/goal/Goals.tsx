// import React, { useEffect, useState, useCallback, FC } from 'react';
// import serviceFactory from '../../../firebase/db/factory';
// import { useAppSelector } from '../../../redux/hooks';
// import { UserGoalData } from '../../../types/firebase/db/user/userStructure';
// import { removeDuplicatesByKey } from '../../../functions/objectUtils';
// import { CircularProgress, Alert } from '@mui/material';
// import { SECONDS_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';
// import GoalsView from './GoalsView';

// const Goals: FC = () => {
//   const { uid, userData } = useAppSelector(state => state.userSlice);
//   const [goals, setGoals] = useState<UserGoalData[]>([]);
//   const [currentGoal, setCurrentGoal] = useState<UserGoalData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showOtherGoals, setShowOtherGoals] = useState<boolean>(false);

//   const updateGoals = useCallback(async () => {
//     if (!uid) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const goalService = serviceFactory.createUserGoalService();
//       const [progressGoals, todayGoals] = await Promise.all([
//         goalService.getAllProgressGoals(uid),
//         goalService.getAllTodayGoals(uid)
//       ]);

//       const goalsData = removeDuplicatesByKey([...progressGoals, ...todayGoals], "docId");
//       let currentGoal = null;

//       if (userData?.currentTargetLearningGoalId) {
//         currentGoal = goalsData.find(goal => goal.docId === userData.currentTargetLearningGoalId) 
//           || await goalService.getGoal(uid, userData.currentTargetLearningGoalId);
//       }

//       setGoals(goalsData);
//       setCurrentGoal(currentGoal);
//     } catch (error) {
//       console.error("Failed to update goals:", error);
//       setError("ゴールの更新に失敗しました。");
//     } finally {
//       setLoading(false);
//     }
//   }, [uid, userData]);

//   useEffect(() => {
//     updateGoals();
//     const interval = setInterval(() => setGoals(prevGoals => [...prevGoals]), 20 * SECONDS_IN_MILLISECOND);

//     return () => clearInterval(interval);
//   }, [updateGoals]);

//   return (
//     <div className='shadow-lg p-1 mt-4 rounded-lg max-h-80 overflow-y-auto'>
//       {loading ? (
//         <CircularProgress />
//       ) : error ? (
//         <Alert severity="error">{error}</Alert>
//       ) : (
//         <GoalsView
//           currentGoal={currentGoal}
//           goals={goals}
//           showOtherGoals={showOtherGoals}
//           toggleOtherGoals={() => setShowOtherGoals(prev => !prev)}
//         />
//       )}
//     </div>
//   );
// };




// export default Goals;
export {}