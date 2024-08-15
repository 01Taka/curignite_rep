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
}

const Members: FC<MembersProps> = ({ members, awayMembers, userMap }) => {
  return (
    <>
      <Typography variant="h6" className="mb-2">
        Members
      </Typography>
      <div className='grid grid-cols-2 gap-2'>
        <MembersContainer members={members} userMap={userMap} away={false} />
        <MembersContainer members={awayMembers} userMap={userMap} away={true} />
      </div>
    </>
  )
}

export default Members