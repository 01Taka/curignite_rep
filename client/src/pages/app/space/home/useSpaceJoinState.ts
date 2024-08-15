import { useEffect, useState } from 'react';
import serviceFactory from '../../../../firebase/db/factory';
import { JoinState } from '../../../../types/firebase/db/baseTypes';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';

export const useSpaceJoinState = (uid: string | null, currentSpaceId: string | null, currentSpace: SpaceData | null) => {
  const [joinState, setJoinState] = useState<JoinState>("loading");

  useEffect(() => {
    const updateJoinState = async () => {
      if (uid && currentSpaceId) {
        const spaceService = serviceFactory.createSpaceService();
        const state = await spaceService.getSpaceJoinState(uid, currentSpace ?? currentSpaceId);
        setJoinState(state);
      }
    };
    updateJoinState();
  }, [uid, currentSpaceId, currentSpace]);

  return joinState;
};
