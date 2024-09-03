import { useEffect, useState } from 'react';
import serviceFactory from '../../../../firebase/db/factory';
import { useAppSelector } from '../../../../redux/hooks';
import { BaseParticipationStatus } from '../../../../types/firebase/db/baseTypes';

export const useSpaceParticipationStatus = () => {
  const [participationStatus, setParticipationStatus] = useState<BaseParticipationStatus | "loading" | "error">("loading");
  const uid = useAppSelector(state => state.userSlice.uid)
  const currentSpaceId = useAppSelector(state => state.spaceSlice.currentSpaceId);

  useEffect(() => {
    const updateParticipationStatus = async () => {
      if (!uid || !currentSpaceId) {
        setParticipationStatus("error");
        return;
      }

      try {
        const spaceService = serviceFactory.createSpaceService();
        const status = await spaceService.getParticipationState(currentSpaceId, uid);
        setParticipationStatus(status);
      } catch (error) {
        console.error("Error fetching join request status: ", error);
        setParticipationStatus("error");
      }
    };

    updateParticipationStatus();
  }, [uid, currentSpaceId]);  // currentSpaceId を依存配列に追加

  return participationStatus;
};
