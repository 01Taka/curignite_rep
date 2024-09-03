import React, { FC } from 'react';
import Participants from './participants/Participants';
import useSpaceData from '../../hooks/useSpaceData';

const ActionIndex: FC = () => {
  const { members, sortedJoinRequests } = useSpaceData();

  return (
    <div className='w-full h-full'>
      <Participants
        members={members}
        joinRequests={sortedJoinRequests}
      />
    </div>
  );
};

export default ActionIndex;
