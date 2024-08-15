import React, { FC, useState, useCallback } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SpaceSettingView from '../../../../features/app/space/start/SpaceSettingView';
import SpaceStartView from '../../../../features/app/space/start/SpaceStartView';
import SpaceJoinPopup from '../../../../features/app/space/start/SpaceJoinPopup';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import serviceFactory from '../../../../firebase/db/factory';
import { SpaceStartFormState } from '../../../../types/app/space/spaceTypes';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';
import { JoinState } from '../../../../types/firebase/db/baseTypes';
import { startNewSpace } from '../../../../functions/app/space/spaceDBUtils';
import { getInitialSpaceStartFormState, setDefaultSpaceFormState } from '../../../../functions/app/space/spaceUtils';
import { dictToArrayWithRevertTimestampConversion, revertTimestampConversion } from '../../../../functions/db/dataFormatUtils';
import { spacePaths } from '../../../../types/path/mainPaths';
import { getLastSegment, replaceParams } from '../../../../functions/path/pathUtils';
import { PathParam } from '../../../../types/path/paths';
import { handleFormStateChange } from '../../../../functions/utils';

interface JoinSpacePopup {
  open: boolean;
  space: SpaceData | null;
  state: JoinState;
}

const SpaceStart: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { spaces } = useAppSelector(state => state.spaceSlice);
  const { uid, userData } = useAppSelector(state => state.userSlice);

  const [formState, setFormState] = useState<SpaceStartFormState>(
    getInitialSpaceStartFormState(userData?.username)
  );
  const [joinSpacePopup, setJoinSpacePopup] = useState<JoinSpacePopup>({
    open: false,
    space: null,
    state: 'error',
  });
  const [isStartingSpace, setIsStartingSpace] = useState(false);

  /**
   * 新しいスペースを開始する
   */
  const handleStartSpace = useCallback(async () => {
    if (!uid) return;
    await startNewSpace(formState, uid, setIsStartingSpace, navigate, dispatch);
  }, [uid, formState, navigate, dispatch]);

  /**
   * デフォルト設定でスペースを開始する
   */
  const startSpaceWithDefaultSetting = useCallback(async () => {
    setFormState(getInitialSpaceStartFormState(userData?.username));
    await handleStartSpace();
  }, [userData?.username, handleStartSpace]);

  /**
   * 現在のフォーム状態をデフォルト設定として保存する
   */
  const handleSetDefaultFormState = useCallback(() => {
    setDefaultSpaceFormState(formState);
  }, [formState]);

  /**
   * 指定したスペースIDのスペースに参加するポップアップを開く
   */
  const handleOpenJoinSpacePopup = useCallback(async (spaceId: string) => {
    if (!uid || !spaceId) return;

    try {
      const space = revertTimestampConversion(spaces[spaceId]);
      if (space) {
        const spaceService = serviceFactory.createSpaceService();
        const state = await spaceService.getSpaceJoinStateWithJoinRequest(uid, space);
  
        setJoinSpacePopup({ open: true, space, state });
        navigate(replaceParams(spacePaths.home, { [PathParam.SpaceId]: spaceId }));
      }
    } catch (error) {
      console.error('Failed to join space: ', error);
    }
  }, [uid, spaces, navigate]);

  /**
   * スペース参加ポップアップを閉じる
   */
  const handleCloseJoinSpacePopup = useCallback(() => {
    setJoinSpacePopup(prevState => ({ ...prevState, open: false }));
  }, []);

  /**
   * スペース参加リクエストを送信する
   */
  const handleSendJoinRequest = useCallback((spaceId: string) => {
    if (!uid || !spaces[spaceId]) return;

    const spaceService = serviceFactory.createSpaceService();
    spaceService.joinSpaceRequest(uid, revertTimestampConversion(spaces[spaceId]) ?? spaceId);
  }, [uid, spaces]);

  /**
   * 指定したスペースに参加する
   */
  const handleJoinSpace = useCallback((spaceId: string) => {
    if (!uid || !spaces[spaceId]) return;

    const spaceService = serviceFactory.createSpaceService();
    spaceService.joinSpace(uid, revertTimestampConversion(spaces[spaceId]) ?? spaceId);
    navigate(replaceParams(spacePaths.home, { [PathParam.SpaceId]: spaceId }));
  }, [uid, spaces, navigate]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <SpaceStartView
              toSetting={() => navigate(spacePaths.startChildren.setting)}
              onStart={startSpaceWithDefaultSetting}
              isStarting={isStartingSpace}
              spaces={dictToArrayWithRevertTimestampConversion(spaces)}
              onSpaceClick={handleOpenJoinSpacePopup}
            />
          }
        />
        <Route
          path={getLastSegment(spacePaths.startChildren.setting)}
          element={
            <SpaceSettingView
              formState={formState}
              isStarting={isStartingSpace}
              onChangeFormState={e => handleFormStateChange(e, setFormState)}
              onCompletion={handleStartSpace}
              onUpdateDefaultSetting={handleSetDefaultFormState}
            />
          }
        />
      </Routes>
      {joinSpacePopup.open && (
        <SpaceJoinPopup
          space={joinSpacePopup.space}
          joinState={joinSpacePopup.state}
          onClose={handleCloseJoinSpacePopup}
          onSendRequest={handleSendJoinRequest}
          onJoinSpace={handleJoinSpace}
        />
      )}
    </>
  );
};

export default SpaceStart;
