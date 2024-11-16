import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import { DocumentIdMap } from '../../../../types/firebase/db/formatTypes';
import { revertTimestampConversion } from '../../../../functions/db/dataFormatUtils';
import serviceFactory from '../../../../firebase/db/factory';
// import JoinRequestService from '../../../../firebase/db/common/joinRequestService';
import { sortObjectArray } from '../../../../functions/utils/objectUtils';
import { UserRead } from '../../../../types/firebase/db/user/userStructure';
import { JoinRequestData } from '../../../../types/firebase/db/common/joinRequest/joinRequestStructure';

const useSpaceData = () => {
  const { currentSpaceId, spaceInfoMap } = useAppSelector(state => state.spaceSlice);
  const [memberUserDataMap, setMemberUserDataMap] = useState<DocumentIdMap<UserRead>>({});

  const currentSpace = useMemo(() => {
    const space = spaceInfoMap[currentSpaceId];
    return space ? revertTimestampConversion(space) : null;
  }, [currentSpaceId, spaceInfoMap]);

  const members = useMemo(() => currentSpace?.members ? sortObjectArray(currentSpace.members, "isAway") : [], [currentSpace]);
  const sortedJoinRequests = [] as JoinRequestData[] //useMemo(() => currentSpace?.joinRequests ? JoinRequestService.sortJoinRequestsByRequestedAt(currentSpace.joinRequests) : [], [currentSpace]); //OUT//

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
  }, [members]);

  return { members, sortedJoinRequests, memberUserDataMap };
};

export default useSpaceData;
