import React, { FC, useEffect, useState, useCallback } from 'react';
import { handleFormStateChange } from '../../../../functions/utils';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { spacePaths, toRelativePaths } from '../../../../types/path/appPaths';
import SpaceSettingView from '../../../../features/app/space/start/SpaceSettingView';
import { initialSpaceStartFormState, SpaceStartFormState } from '../../../../types/app/spaceTypes';
import SpaceStartView from '../../../../features/app/space/start/SpaceStartView';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';
import { handleCreateSpace, updateSpaces } from '../../../../functions/app/space/spaceDBUtils';
import { handleSetDefaultFormState, initializeSpaceSetting } from '../../../../functions/app/space/spaceUtils';
import serviceFactory from '../../../../firebase/db/factory';
import { useAppSelector } from '../../../../redux/hooks';

const SpaceStart: FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<SpaceStartFormState>(initialSpaceStartFormState);
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const { uid, userData } = useAppSelector(state => state.userSlice);

  const fetchAndSetSpaceData = useCallback(async () => {
    if (uid) {
      try {
        const spacesData = await updateSpaces(uid);
        setSpaces(spacesData);
      } catch (error) {
        console.error('Failed to fetch spaces: ', error);
      }
    }
  }, [uid]);

  useEffect(() => {
    const initializeAndFetchData = async () => {
      const formState = await initializeSpaceSetting(userData?.username);
      setFormState(formState);
      await fetchAndSetSpaceData();
    };

    initializeAndFetchData();
  }, [fetchAndSetSpaceData, userData]);

  const handleDefaultStart = async () => {
    if (uid) {
      await handleCreateSpace(formState, uid);
      navigate(spacePaths.home);
    }
  };

  const handleSettingCompletion = async () => {
    if (uid) {
      handleSetDefaultFormState(formState);
      handleCreateSpace(formState, uid);
      navigate(spacePaths.home);
    }
  };

  const handleJoinSpace = async (spaceId: string) => {
    if (uid) {
      const spaceService = serviceFactory.createSpaceService(uid);
      console.log(await spaceService.getSpaceJoinStateWithJoinRequest(uid, spaceId));
    }
  }

  return (
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
        path={toRelativePaths(spacePaths.startChildren.setting)}
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
  );
};

export default SpaceStart;
