import { Avatar, ListItemAvatar } from '@mui/material'
import React, { FC } from 'react'
import { DocumentIdMap } from '../../../../../../types/firebase/db/formatTypes';
import { cn } from '../../../../../../functions/utils';
import { BaseMemberRole } from '../../../../../../types/firebase/db/baseTypes';
import { SpaceMemberData } from '../../../../../../types/firebase/db/space/spaceStructure';
import { UserData } from '../../../../../../types/firebase/db/user/userStructure';

interface MembersProps {
  members: SpaceMemberData[];
  userMap: DocumentIdMap<UserData>;
  onClickMember?: (member: SpaceMemberData) => void;
}

const Members: FC<MembersProps> = ({ members, userMap, onClickMember }) => (
  <>
    {members ? members.map((member) => {
      const user = userMap[member.userId];
      return (
        <div
          key={member.userId}
          className={cn('flex h-14 p-2 rounded-md', member.isAway ? "bg-gray-300" : "bg-secondaryBase")}
          onClick={onClickMember ? () => onClickMember(member) : () => {}}
        >
          <ListItemAvatar>
            <Avatar src={user?.iconUrl} />
          </ListItemAvatar>
          <div className={cn('flex flex-col justify-center')}>
            <span className={cn("text-sm", member.role === BaseMemberRole.Admin && "text-red-500", member.role === BaseMemberRole.Guest && "text-green-500")}>
              {member.role === BaseMemberRole.Admin ? "管理人"
              : member.role === BaseMemberRole.Guest ?
              "ゲスト" : ""
              }</span>
            <span className='text-grayText'>{user?.username}</span>
          </div>
        </div>
      );
    }) : null}
  </>
)

export default Members