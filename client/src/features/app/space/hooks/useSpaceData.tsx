import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import { DocumentIdMap } from '../../../../types/firebase/db/formatTypes';
import { revertTimestampConversion } from '../../../../functions/db/dataFormatUtils';
import serviceFactory from '../../../../firebase/db/factory';
import JoinRequestService from '../../../../firebase/db/common/joinRequestService';
import { sortArray } from '../../../../functions/objectUtils';
import { UserData } from '../../../../types/firebase/db/user/userStructure';

const useSpaceData = () => {
  const { currentSpaceId, spaceInfoMap } = useAppSelector(state => state.spaceSlice);
  const [memberUserDataMap, setMemberUserDataMap] = useState<DocumentIdMap<UserData>>({});

  const currentSpace = useMemo(() => {
    const space = spaceInfoMap[currentSpaceId];
    return space ? revertTimestampConversion(space) : null;
  }, [currentSpaceId, spaceInfoMap]);

  const members = useMemo(() => currentSpace?.members ? sortArray(currentSpace.members, "isAway") : [], [currentSpace]);
  const sortedJoinRequests = useMemo(() => currentSpace?.joinRequests ? JoinRequestService.sortJoinRequestsByRequestedAt(currentSpace.joinRequests) : [], [currentSpace]);

  useEffect(() => {
    const updateUserMap = async () => {
      const userService = serviceFactory.createUserService();
      const uids = [
        ...(members ? members.map(member => member.userId) : []),
      ];
      const userMap = await userService.getUserMapByUids(uids);
      setMemberUserDataMap(userMap);
    };
    updateUserMap();
  }, [members, sortedJoinRequests]);

  return { members, sortedJoinRequests, memberUserDataMap };
};

export default useSpaceData;
