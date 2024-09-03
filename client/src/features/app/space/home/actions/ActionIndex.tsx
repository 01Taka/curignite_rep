import React, { FC } from 'react';
import Participants from './participants/Participants';
import useSpaceData from '../../hooks/useSpaceData';

const ActionIndex: FC = () => {
  const { members, awayMembers, sortedJoinRequests, userDataMap } = useSpaceData();

  return (
    <div className='w-full h-full'>
      <Participants
        members={members}
        awayMembers={awayMembers}
        joinRequests={sortedJoinRequests}
        userMap={userDataMap}
      />
    </div>
  );
};

export default ActionIndex;
