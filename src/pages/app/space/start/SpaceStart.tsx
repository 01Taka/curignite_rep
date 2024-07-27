import React, { FC, useEffect, useState, useCallback } from 'react';
import { spacesDB } from '../../../../firebase/db/dbs';
import { handleFormStateChange } from '../../../../functions/utils';
import { appendSpaceIdToUserData, getCurrentUserData } from '../../../../firebase/db/app/user/userDBUtil';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { spacePaths, toRelativePaths } from '../../../../types/path/appPaths';
import { getParticipationPossibleSpaces } from '../../../../firebase/db/app/space/spacesDBUtil';
import SpaceSettingView from '../../../../features/app/space/start/SpaceSettingView';
import { initialSpaceStartFormState, SpaceStartFormState } from '../../../../types/app/spaceTypes';
import SpaceStartView from '../../../../features/app/space/start/SpaceStartView';
import { SpaceData } from '../../../../types/firebase/db/spacesTypes';
import { spaceStorage } from '../../../../functions/localStorage/storages';
import { SpaceStorageProps } from '../../../../types/app/localStorageTypes';
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
    const data = spaceStorage.getDataAllAtOnce();
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
    const data: SpaceStorageProps = {
      spaceName: formState.spaceName,
      introduction: formState.introduction,
      publicationTarget: formState.publicationTarget,
      requiredApproval: String(formState.requiredApproval) as StringBoolean,
    };
    console.log(data);
    
    spaceStorage.setDataAllAtOnce(data);
  };

  const handleCreateSpace = async (formState: SpaceStartFormState) => {
    const userData = await getCurrentUserData();
    const uid = userData?.documentId;

    if (uid) {
      try {
        const space = await spacesDB.createSpace(
          formState.spaceName,
          formState.introduction,
          uid,
          formState.publicationTarget,
          formState.requiredApproval,
          []
        );
        await appendSpaceIdToUserData(uid, space.id);
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
