import React, { FC, useEffect, useState, useCallback } from 'react';
import { handleFormStateChange } from '../../../../functions/utils';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SpaceSettingView from '../../../../features/app/space/start/SpaceSettingView';
import { initialSpaceStartFormState, SpaceStartFormState } from '../../../../types/app/space/spaceTypes';
import SpaceStartView from '../../../../features/app/space/start/SpaceStartView';
import { SpaceData, SpaceJoinState } from '../../../../types/firebase/db/space/spacesTypes';
import { handleCreateSpace, updateSpaces } from '../../../../functions/app/space/spaceDBUtils';
import { handleSetDefaultFormState, initializeSpaceSetting } from '../../../../functions/app/space/spaceUtils';
import { useAppSelector } from '../../../../redux/hooks';
import { spacePaths } from '../../../../types/path/mainPaths';
import { getLastSegment } from '../../../../functions/path/pathUtils';
import SpaceJoinPopup from '../../../../features/app/space/start/SpaceJoinPopup';
import serviceFactory from '../../../../firebase/db/factory';

interface JoinSpacePopup {
  open: boolean;
  space: SpaceData | null;
  state: SpaceJoinState;
}

const SpaceStart: FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<SpaceStartFormState>(initialSpaceStartFormState);
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const [joinSpacePopup, setJoinSpacePopup] = useState<JoinSpacePopup>({
    open: false,
    space: null,
    state: "error",
  });

  const { uid, userData } = useAppSelector(state => state.userSlice);

  const fetchAndSetSpaceData = useCallback(async () => {
    if (!uid) return;
    try {
      const spacesData = await updateSpaces(uid);
      setSpaces(spacesData);
    } catch (error) {
      console.error('Failed to fetch spaces: ', error);
    }
  }, [uid]);

  const initializeAndFetchData = useCallback(async () => {
    const initialState = await initializeSpaceSetting(userData?.username);
    setFormState(initialState);
    await fetchAndSetSpaceData();
  }, [fetchAndSetSpaceData, userData?.username]);

  useEffect(() => {
    initializeAndFetchData();
  }, [initializeAndFetchData]);

  const handleDefaultStart = async () => {
    if (!uid) return;
    await handleCreateSpace(formState, uid);
    navigate(spacePaths.home);
  };

  const handleSettingCompletion = async () => {
    if (!uid) return;
    await handleSetDefaultFormState(formState);
    await handleCreateSpace(formState, uid);
    navigate(spacePaths.home);
  };

  const handleJoinSpace = async (spaceId: string) => {
    if (!uid || !spaceId) return;
    try {
      const spacesDB = serviceFactory.getSpacesDB();
      const spaceService = serviceFactory.createSpaceService();
      const space = await spacesDB.getSpace(spaceId);
      const state = await spaceService.getSpaceJoinStateWithJoinRequest(uid, spaceId);
      setJoinSpacePopup({
        open: true,
        space,
        state,
      });
    } catch (error) {
      console.error('Failed to join space: ', error);
    }
  }

  const onCloseJoinSpacePopup = () => {
    setJoinSpacePopup({...joinSpacePopup, open: false});
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <SpaceStartView
              toSetting={() => navigate(spacePaths.startChildren.setting)}
              onStart={handleDefaultStart}
              spaces={spaces}
              onSpaceClick={handleJoinSpace}
            />
          }
        />
        <Route
          path={getLastSegment(spacePaths.startChildren.setting)}
          element={
            <SpaceSettingView
              formState={formState}
              onChangeFormState={(e) => handleFormStateChange(e, setFormState)}
              onCompletion={handleSettingCompletion}
              onUpdateDefaultSetting={() => handleSetDefaultFormState(formState)}
            />
          }
        />
      </Routes>
      {joinSpacePopup.open && 
        <SpaceJoinPopup
          space={joinSpacePopup.space}
          joinState={joinSpacePopup.state}
          onClose={onCloseJoinSpacePopup}
        />
      }
    </>
  );
};

export default SpaceStart;
