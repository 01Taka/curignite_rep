import { useEffect, useState } from 'react';
import serviceFactory from '../../../../firebase/db/factory';
import { SpaceData } from '../../../../types/firebase/db/space/spaceStructure';
import { JoinRequestState } from '../../../../types/firebase/db/common/joinRequest/joinRequestStructure';

export const useSpaceJoinState = (uid: string | null, currentSpaceId: string | null, currentSpace: SpaceData | null) => {
  const [joinState, setJoinState] = useState<JoinRequestState | "loading" | "error">("loading");

  useEffect(() => {
    const updateJoinState = async () => {
      if (uid && currentSpaceId) {
        const spaceService = serviceFactory.createTeamJoinRequestService();
        const data = await spaceService.getJoinRequest(currentSpaceId, uid);
        if (data) {
          setJoinState(data.state);
        } else {
          setJoinState("error");
        }
      }
    };
    updateJoinState();
  }, [uid, currentSpaceId, currentSpace]);

  return joinState;
};
