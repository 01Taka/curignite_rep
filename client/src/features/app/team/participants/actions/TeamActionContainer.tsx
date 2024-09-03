// import React, { FC } from 'react'
// import { ActionInfo } from '../../../../../types/firebase/db/baseTypes'
// import { TeamActionTypes } from '../../../../../types/firebase/db/team/teamsTypes'
// import { UserData } from '../../../../../types/firebase/db/user/usersTypes';
// import { Avatar } from '@mui/material';
// import { dateTimeToString } from '../../../../../functions/dateTimeUtils';

// interface TeamActionContainerProps {
//   action: ActionInfo<TeamActionTypes>;
//   user: UserData;
// }

// const TeamActionContainer: FC<TeamActionContainerProps> = ({ action, user }) => {
//   return (
//     <div key={action.userId}>
//       <Avatar alt={`${user.username}のアイコン`} src={user.iconUrl}>
//         {user.username}
//       </Avatar>
//       {action.actionType}
//       {dateTimeToString(action.actionAt, { isAbsolute: true, format: "MM/dd HH:mm" })}
//     </div>
//   )
// }

// export default TeamActionContainer

export {}