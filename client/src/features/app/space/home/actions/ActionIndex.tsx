import { FC, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../../../redux/hooks';
import { revertTimestampConversion } from '../../../../../functions/db/dataFormatUtils';
import { sortJoinRequestsByActionTime } from '../../../../../functions/app/space/menuUtils';
import { UserData } from '../../../../../types/firebase/db/user/usersTypes';
import { DocumentIdMap } from '../../../../../types/firebase/db/formatTypes';
import serviceFactory from '../../../../../firebase/db/factory';
import Participants from './participants/Participants';
// import { sampleSpaceData } from '../../../../../test/testData';

const ActionIndex: FC = () => {
  const { currentSpaceId, spaces } = useAppSelector(state => state.spaceSlice);
  const [userDataMap, setUserDataMap] = useState<DocumentIdMap<UserData>>({});

  const currentSpace = useMemo(() => {
    const space = spaces[currentSpaceId];
    return space ? revertTimestampConversion(space) : null;
  }, [currentSpaceId, spaces]);

  const members = useMemo(() => currentSpace ? currentSpace.members : [], [currentSpace]);
  const awayMembers = useMemo(() => currentSpace ? currentSpace.awayUsers : [], [currentSpace]);
  const sortedJoinRequests = useMemo(() => currentSpace ? sortJoinRequestsByActionTime(currentSpace) : [], [currentSpace]);

  useEffect(() => {
    const updateUserMap = async () => {
      const userService = serviceFactory.createUserService();
      const uids = [
        ...(members ? members.map(member => member.userId) : []),
        ...(awayMembers ? awayMembers.map(member => member.userId) : []),
        ...(sortedJoinRequests ? sortedJoinRequests.map(request => request.userId) : []),
      ];
      const userMap = await userService.getUserMapByUids(uids);
      setUserDataMap(userMap);
    };
    updateUserMap();
  }, [members, awayMembers, sortedJoinRequests]);

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
