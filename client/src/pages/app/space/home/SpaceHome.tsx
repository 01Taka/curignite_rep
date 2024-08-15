import React, { FC, useEffect, useState } from 'react';
import SpaceHomeView from '../../../../features/app/space/home/SpaceHomeView';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { useParams } from 'react-router-dom';
import { PathParam } from '../../../../types/path/paths';
import { setCurrentSpaceId } from '../../../../redux/slices/space/spaceSlice';
import AccessStateErrorMessage from '../../../../features/utils/messages/AccessStateErrorMessage';
import { isApprovedJoinState } from '../../../../functions/db/dbUtils';
import { useSpaceJoinState } from './useSpaceJoinState';
import { revertTimestampConversion } from '../../../../functions/db/dataFormatUtils';
import { moveLearningSession } from '../../../../functions/app/space/learningSessionUtils';
import { JoinState } from '../../../../types/firebase/db/baseTypes';

const SpaceHome: FC = () => {
  const params = useParams();
  const spaceId = params[PathParam.SpaceId];
  const dispatch = useAppDispatch();
  const { spaces, currentSpaceId } = useAppSelector(state => state.spaceSlice);
  const { uid } = useAppSelector(state => state.userSlice);
  const [joinState, setJoinState] = useState<JoinState>("loading");
  
  const currentSpace = revertTimestampConversion(spaces[currentSpaceId]);
  const joinStateFromHook = useSpaceJoinState(uid, currentSpaceId, currentSpace);

  useEffect(() => {
    if (currentSpace) {
      setJoinState(joinStateFromHook);
    }
  }, [currentSpace, joinStateFromHook]);

  useEffect(() => {
    if (uid && spaceId && currentSpaceId !== spaceId) {
      dispatch(setCurrentSpaceId(spaceId));
      moveLearningSession(dispatch, uid, spaceId); // 非同期関数です
    }
  }, [uid, spaceId, currentSpaceId, dispatch]);

  return isApprovedJoinState(joinState) ? (
    <SpaceHomeView />
  ) : (
    <AccessStateErrorMessage
      joinState={joinState}
      message={
        <>
          このスペースは存在しないかアクセスが許可されていません。<br />
          URLが正しいかを確認してください。
        </>
      }
    />
  );
};

export default SpaceHome;
