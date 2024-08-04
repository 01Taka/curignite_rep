import React, { FC, useEffect, useState, useCallback } from 'react';
import { handleFormStateChange } from '../../../../functions/utils';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { spacePaths, toRelativePaths } from '../../../../types/path/appPaths';
import SpaceSettingView from '../../../../features/app/space/start/SpaceSettingView';
import { initialSpaceStartFormState, SpaceStartFormState } from '../../../../types/app/spaceTypes';
import SpaceStartView from '../../../../features/app/space/start/SpaceStartView';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';
import { getCurrentUser } from '../../../../firebase/auth/auth';
import { handleCreateSpace, updateSpaces } from '../../../../functions/app/space/spaceDBUtils';
import { getDefaultSpaceName, handleSetDefaultFormState, initializeSpaceSetting } from '../../../../functions/app/space/spaceUtils';

const SpaceStart: FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<SpaceStartFormState>(initialSpaceStartFormState);
  const [spaces, setSpaces] = useState<SpaceData[]>([]);

  const fetchAndSetSpaceData = useCallback(async () => {
    const user = await getCurrentUser();
    const uid = user?.uid;

    if (uid) {
      try {
        const spacesData = await updateSpaces(uid);
        setSpaces(spacesData);
      } catch (error) {
        console.error('Failed to fetch spaces: ', error);
      }
    }
  }, []);

  useEffect(() => {
    const initializeAndFetchData = async () => {
      const formState = await initializeSpaceSetting(getDefaultSpaceName);
      setFormState(formState);
      await fetchAndSetSpaceData();
    };

    initializeAndFetchData();
  }, [fetchAndSetSpaceData]);

  const handleDefaultStart = async () => {
    await handleCreateSpace(formState, (await getCurrentUser())?.uid || "");
    navigate(spacePaths.home);
  };

  const handleSettingCompletion = async () => {
    handleSetDefaultFormState(formState);
    handleCreateSpace(formState, (await getCurrentUser())?.uid || "");
    navigate(spacePaths.home);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <SpaceStartView
            toSetting={() => navigate(spacePaths.startChildren.setting)}
            onStart={handleDefaultStart}
            spaces={spaces}
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
