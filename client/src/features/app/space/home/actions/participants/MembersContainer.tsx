import { Avatar, ListItemAvatar } from '@mui/material'
import React, { FC } from 'react'
import { Member, RoleType } from '../../../../../../types/firebase/db/baseTypes'
import { DocumentIdMap } from '../../../../../../types/firebase/db/formatTypes';
import { UserData } from '../../../../../../types/firebase/db/user/usersTypes';
import { cn } from '../../../../../../functions/utils';

interface MembersContainerProps {
  members: Member[];
  userMap: DocumentIdMap<UserData>;
  away: boolean;
}

const MembersContainer: FC<MembersContainerProps> = ({ members, userMap, away }) => (
  <>
    {members ? members.map((member) => {
      const user = userMap[member.userId];
      return (
        <div key={member.userId} className={cn('flex h-14 p-2 rounded-md', away ? "bg-gray-300" : "bg-secondaryBase")}>
          <ListItemAvatar>
            <Avatar src={user?.iconUrl} />
          </ListItemAvatar>
          <div className={cn('flex flex-col justify-center')}>
            <span className={cn("text-sm", member.role === RoleType.Admin && "text-red-500", member.role === RoleType.Guest && "text-green-500")}>
              {member.role === RoleType.Admin ? "管理人"
              : member.role === RoleType.Guest ?
              "ゲスト" : ""
              }</span>
            <span className='text-grayText'>{user?.username}</span>
          </div>
        </div>
      );
    }) : null}
  </>
)

export default MembersContainer