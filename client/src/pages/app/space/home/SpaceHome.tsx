import React, { FC, useEffect } from 'react';
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

const SpaceHome: FC = () => {
  const params = useParams();
  const spaceId = params[PathParam.SpaceId];
  const dispatch = useAppDispatch();
  const { spaces, currentSpaceId } = useAppSelector(state => state.spaceSlice);
  const { uid } = useAppSelector(state => state.userSlice);
  
  const currentSpace = revertTimestampConversion(spaces[currentSpaceId]);
  const joinState = useSpaceJoinState(uid, currentSpaceId, currentSpace);

  useEffect(() => {
    if (uid && spaceId && currentSpaceId !== spaceId) {
      dispatch(setCurrentSpaceId(spaceId));
      moveLearningSession(dispatch, uid, spaceId); // 非同期関数です
    }
  }, [uid, spaceId, currentSpaceId, dispatch]);

  return isApprovedJoinState(joinState) ? (
    <SpaceHomeView space={currentSpace} />
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
