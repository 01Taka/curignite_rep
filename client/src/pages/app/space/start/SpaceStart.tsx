import React, { FC, useState, useCallback } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SpaceSettingView from '../../../../features/app/space/start/SpaceSettingView';
import SpaceStartView from '../../../../features/app/space/start/SpaceStartView';
import SpaceJoinPopup from '../../../../features/app/space/start/SpaceJoinPopup';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import serviceFactory from '../../../../firebase/db/factory';
import { SpaceStartFormState } from '../../../../types/app/space/spaceTypes';
import { SpaceData } from '../../../../types/firebase/db/space/spaceStructure';
import { startNewSpace } from '../../../../functions/app/space/spaceDBUtils';
import { getInitialSpaceStartFormState, setDefaultSpaceFormState } from '../../../../functions/app/space/spaceUtils';
import { spacePaths } from '../../../../types/path/mainPaths';
import { getLastSegment, replaceParams } from '../../../../functions/path/pathUtils';
import { PathParam } from '../../../../types/path/paths';
import { handleFormStateChange } from '../../../../functions/utils';
import { BaseParticipationState } from '../../../../types/firebase/db/baseTypes';
import { useSpaces } from '../../../../features/app/space/hooks/useSpaceInfo';
import { getSpaceInfo } from '../../../../redux/actions/space/spaceActions';

interface JoinSpacePopupProps {
  open: boolean;
  space: SpaceData | null;
  participationState: BaseParticipationState | "error";
}

const SpaceStart: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const spaces = useSpaces();
  const { uid, userData } = useAppSelector(state => state.userSlice);

  const [formState, setFormState] = useState<SpaceStartFormState>(
    getInitialSpaceStartFormState(userData?.username)
  );
  const [joinSpacePopup, setJoinSpacePopup] = useState<JoinSpacePopupProps>({
    open: false,
    space: null,
    participationState: 'error',
  });
  const [isStartingSpace, setIsStartingSpace] = useState(false);

  /**
   * 新しいスペースを開始する
   */
  const handleStartSpace = useCallback(async () => {
    if (!uid) return;

    try {
      await startNewSpace(formState, uid, setIsStartingSpace, navigate, dispatch);
    } catch (error) {
      console.error('Failed to start new space:', error);
    }
  }, [uid, formState, navigate, dispatch]);

  /**
   * デフォルト設定でスペースを開始する
   */
  const handleStartSpaceWithDefaultSettings = useCallback(async () => {
    setFormState(getInitialSpaceStartFormState(userData?.username));
    await handleStartSpace();
  }, [userData?.username, handleStartSpace]);

  /**
   * 現在のフォーム状態をデフォルト設定として保存する
   */
  const handleSaveDefaultFormState = useCallback(() => {
    setDefaultSpaceFormState(formState);
  }, [formState]);

  /**
   * 指定したスペースIDのスペースに参加するポップアップを開く
   */
  const handleOpenJoinSpacePopup = useCallback(async (spaceId: string) => {
    if (!uid || !spaceId) return;

    try {
      const space = getSpaceInfo(spaceId).space;
      if (space) {
        const spaceService = serviceFactory.createSpaceService();
        const participationState = await spaceService.getParticipationState(uid, spaceId);

        setJoinSpacePopup({ open: true, space, participationState });
        navigate(replaceParams(spacePaths.home, { [PathParam.SpaceId]: spaceId }));
      }
    } catch (error) {
      console.error('Failed to open join space popup:', error);
    }
  }, [uid, navigate]);

  /**
   * スペース参加ポップアップを閉じる
   */
  const handleCloseJoinSpacePopup = useCallback(() => {
    setJoinSpacePopup(prevState => ({ ...prevState, open: false }));
  }, []);

  /**
   * 指定したスペースに参加する
   */
  const handleJoinSpace = useCallback(async (spaceId: string) => {
    if (!userData) return;

    try {
      const spaceService = serviceFactory.createSpaceService();
      const result = await spaceService.handleSpaceJoin(spaceId, userData);

      if (result === "joined") {
        navigate(replaceParams(spacePaths.home, { [PathParam.SpaceId]: spaceId }));
      }
    } catch (error) {
      console.error('Failed to join space:', error);
    }
  }, [userData, navigate]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <SpaceStartView
              toSetting={() => navigate(spacePaths.startChildren.setting)}
              onStart={handleStartSpaceWithDefaultSettings}
              isStarting={isStartingSpace}
              spaces={spaces}
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
              onUpdateDefaultSetting={handleSaveDefaultFormState}
            />
          }
        />
      </Routes>
      {joinSpacePopup.open && (
        <SpaceJoinPopup
          space={joinSpacePopup.space}
          joinState={joinSpacePopup.participationState}
          onClose={handleCloseJoinSpacePopup}
          handleSpaceJoin={handleJoinSpace}
        />
      )}
    </>
  );
};

export default SpaceStart;
