// import React, { FC, useEffect, useState, useCallback } from 'react';
// import { ActionInfo } from '../../../../../types/firebase/db/baseTypes';
// import { TeamActionTypes } from '../../../../../types/firebase/db/team/teamsTypes';
// import TeamActionContainer from './TeamActionContainer';
// import { DocumentIdMap } from '../../../../../types/firebase/db/formatTypes';
// import { UserData } from '../../../../../types/firebase/db/user/usersTypes';
// import serviceFactory from '../../../../../firebase/db/factory';
// import { CircularProgress } from '@mui/material';

// interface TeamActionsProps {
//   actions: ActionInfo<TeamActionTypes>[];
// }

// const TeamActions: FC<TeamActionsProps> = ({ actions }) => {
//   const [userMap, setUserMap] = useState<DocumentIdMap<UserData> | null>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUserMap = useCallback(async () => {
//     try {
//       const userService = serviceFactory.createUserService();
//       const uids = actions.map(action => action.userId);
//       const userMap = await userService.getUserMapByUids(uids);
//       setUserMap(userMap);
//     } catch (error) {
//       console.error('ユーザーデータの取得中にエラーが発生しました:', error);
//       setUserMap(null);
//     } finally {
//       setLoading(false);
//     }
//   }, [actions]);

//   useEffect(() => {
//     if (actions.length > 0) {
//       fetchUserMap();
//     } else {
//       setLoading(false);
//     }
//   }, [actions, fetchUserMap]);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   return (
//     <div>
//       {userMap && actions.length > 0 ? (
//         actions.map(action => (
//           <TeamActionContainer key={action.userId} action={action} user={userMap[action.userId]} />
//         ))
//       ) : (
//         <div>アクションがありません。</div>
//       )}
//     </div>
//   );
// };

// export default TeamActions;

export {}
