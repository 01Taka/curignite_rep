import React, { FC, useEffect, useState, useCallback } from 'react';
import { handleFormStateChange } from '../../../../functions/utils';
import { getCurrentUserData } from '../../../../firebase/db/app/user/userDBUtil';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { spacePaths, toRelativePaths } from '../../../../types/path/appPaths';
import { createSpace, getParticipationPossibleSpaces } from '../../../../firebase/db/app/space/SpaceService';
import SpaceSettingView from '../../../../features/app/space/start/SpaceSettingView';
import { initialSpaceStartFormState, SpaceStartFormState } from '../../../../types/app/spaceTypes';
import SpaceStartView from '../../../../features/app/space/start/SpaceStartView';
import { SpaceData } from '../../../../types/firebase/db/spacesTypes';
import { spaceDefaultSettingStorage } from '../../../../functions/localStorage/storages';
import { SpaceDefaultSettingStorageProps } from '../../../../types/app/localStorageTypes';
import { StringBoolean } from '../../../../types/util/componentsTypes';

const SpaceStart: FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<SpaceStartFormState>(initialSpaceStartFormState);
  const [spaces, setSpaces] = useState<SpaceData[]>([]);

  const getDefaultSpaceName = useCallback(async (username: string | null = null): Promise<string> => {
    if (!username) {
      const userData = await getCurrentUserData();
      username = userData ? userData.username : "無名";
    }
    return `${username}のスペース`;
  }, []);

  const initializeSpaceSetting = useCallback(async () => {
    const data = spaceDefaultSettingStorage.getDataAllAtOnce();
    const formState: SpaceStartFormState = {
      spaceName: data.spaceName ?? await getDefaultSpaceName(),
      introduction: data.introduction ?? "",
      publicationTarget: data.publicationTarget ?? "team",
      requiredApproval: data.requiredApproval === "true",
    };
    setFormState(formState);
  }, [getDefaultSpaceName]);

  const updateSpaces = useCallback(async () => {
    const userData = await getCurrentUserData();
    const uid = userData?.documentId;
    if (uid) {
      try {
        const spaces = await getParticipationPossibleSpaces(uid);
        setSpaces(spaces);
      } catch (error) {
        console.error('Failed to fetch spaces: ', error);
      }
    }
  }, []);

  useEffect(() => {
    initializeSpaceSetting();
    updateSpaces();
  }, [initializeSpaceSetting, updateSpaces]);

  const handleSetDefaultFormState = (formState: SpaceStartFormState) => {
    const data: SpaceDefaultSettingStorageProps = {
      spaceName: formState.spaceName,
      introduction: formState.introduction,
      publicationTarget: formState.publicationTarget,
      requiredApproval: String(formState.requiredApproval) as StringBoolean,
    };

    spaceDefaultSettingStorage.setDataAllAtOnce(data);
  };

  const handleCreateSpace = async (formState: SpaceStartFormState) => {
    const userData = await getCurrentUserData();
    const uid = userData?.documentId;

    if (uid) {
      try {
        await createSpace(
          formState.spaceName,
          formState.introduction,
          uid,
          formState.publicationTarget,
          formState.requiredApproval,
        );
      } catch (error) {
        console.error('Failed to create space: ', error);
      }
    }
  };

  const handleDefaultStart = async () => {
    await initializeSpaceSetting();
    await handleCreateSpace(formState);
    navigate(spacePaths.home);
  };

  const handleSettingCompletion = () => {
    handleCreateSpace(formState);
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
