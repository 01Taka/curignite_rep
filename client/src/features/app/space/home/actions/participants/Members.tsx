import React, { FC } from 'react'
import { Typography } from '@mui/material';
import { Member } from '../../../../../../types/firebase/db/baseTypes';
import { DocumentIdMap } from '../../../../../../types/firebase/db/formatTypes';
import { UserData } from '../../../../../../types/firebase/db/user/usersTypes';
import MembersContainer from './MembersContainer';

interface MembersProps {
  members: Member[];
  awayMembers: Member[];
  userMap: DocumentIdMap<UserData>;
  onClickMember?: (member: Member, isAway: boolean) => void;
}

const Members: FC<MembersProps> = ({ members, awayMembers, userMap, onClickMember }) => {
  return (
    <>
      <div className='grid grid-cols-2 gap-2'>
        <MembersContainer members={members} userMap={userMap} away={false} onClickMember={onClickMember} />
        <MembersContainer members={awayMembers} userMap={userMap} away={true} onClickMember={onClickMember} />
      </div>
    </>
  )
}

export default Members