import React, { FC, useEffect } from 'react';
import SpaceHomeView from '../../../../features/app/space/home/SpaceHomeView';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { useParams } from 'react-router-dom';
import { PathParam } from '../../../../types/path/paths';
import { setCurrentSpaceId } from '../../../../redux/slices/space/spaceSlice';
import AccessStateErrorMessage from '../../../../features/utils/messages/AccessStateErrorMessage';
import { BaseParticipationStatus } from '../../../../types/firebase/db/baseTypes';
import { CircularProgress } from '@mui/material';
import { useSpaceParticipationStatus } from '../../../../features/app/space/hooks/useSpaceParticipationState';

const SpaceHome: FC = () => {
  const params = useParams();
  const spaceId = params[PathParam.SpaceId];
  const dispatch = useAppDispatch();
  const { currentSpaceId } = useAppSelector(state => state.spaceSlice);
  const { uid } = useAppSelector(state => state.userSlice);

  const participationStatus = useSpaceParticipationStatus();

  useEffect(() => {
    if (uid && spaceId && currentSpaceId !== spaceId) {
      dispatch(setCurrentSpaceId(spaceId));
      // moveLearningSession(dispatch, uid, spaceId); // UNDONE
    }
  }, [uid, spaceId, currentSpaceId, dispatch]);

  const isValidParticipationStatus = (status: BaseParticipationStatus | "error"): boolean => {
    if (status === "error") return false;
    return [BaseParticipationStatus.Active, BaseParticipationStatus.Declined].includes(status);
  }

  return participationStatus === "loading" ? (
    <CircularProgress />
  ) : isValidParticipationStatus(participationStatus) ? (
    <SpaceHomeView />
  ) : (
    <AccessStateErrorMessage message='このチームへのアクセスは許可されていません。'/>
  );
};

export default SpaceHome;
