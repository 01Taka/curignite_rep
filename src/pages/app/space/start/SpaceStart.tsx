import React, { FC, useEffect, useState } from 'react';
import SpaceStartView, { initialSpaceStartFormState, SpaceStartFormState } from './SpaceStartView';
import { spacesDB } from '../../../../firebase/db/dbs';
import { handleFormStateChange } from '../../../../functions/utils';
import { getCurrentUser } from '../../../../firebase/auth/auth';
import { appendSpaceIdToUserData, getCurrentUserData } from '../../../../firebase/db/app/user/userDBUtil';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { spacePaths, toRelativePaths } from '../../../../types/path/appPaths';
import SpaceSetting from './setting/SpaceSetting';
import { getParticipationPossibleSpaces } from '../../../../firebase/db/app/space/spacesDBUtil';

const SpaceStart: FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<SpaceStartFormState>(initialSpaceStartFormState);

  useEffect(() => {
    const initializeSpaceName = async () => {
      if (!formState.spaceName) {
        const userData = await getCurrentUserData();
        if (userData) {
          setFormState({ ...formState, spaceName: `${userData.username}のスペース` });
          console.log(await getParticipationPossibleSpaces(userData.documentId));
        } 
      }
    }

    initializeSpaceName();    
  }, [formState]);

  const handleSettingCompletion = () => {
    navigate(spacePaths.start);
  }

  const handleCreateSpace = async () => {
    try {
      const user = await getCurrentUser();
      const uid = user?.uid;
      if (uid) {
        const space = await spacesDB.createSpace(
          formState.spaceName,
          formState.introduction,
          uid,
          formState.publicationTarget,
          formState.requiredApproval,
          []
        );

        await appendSpaceIdToUserData(uid, space.id);
      }
    } catch (error) {
      console.error('Failed to create space: ', error);
    }
  }

  return (
    <Routes>
      <Route path='/'
      element={
        <SpaceStartView 
          toSetting={() => navigate(spacePaths.startChildren.setting)}
          onCreateSpace={handleCreateSpace}
          spaces={[]}
        />}
      />
      <Route path={toRelativePaths(spacePaths.startChildren.setting)}
        element={
        <SpaceSetting
          formState={formState}
          onChangeFormState={e => handleFormStateChange(e, setFormState)}
          onCompletion={handleSettingCompletion}
        />}
      />
    </Routes>
  );
}

export default SpaceStart;
