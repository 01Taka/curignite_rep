import React, { FC, useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import SpaceContainer from './SpaceContainer';
import SpacesEmptyMessage from './SpacesEmptyMessage';
import { dateTimeToString } from '../../../../functions/dateTimeUtils';
import { SpacesProps } from '../../../../types/app/space/spaceTypes';
import { DocumentIdMap } from '../../../../types/firebase/db/formatTypes';
import serviceFactory from '../../../../firebase/db/factory';
import { UserData } from '../../../../types/firebase/db/user/userStructure';

const Spaces: FC<SpacesProps> = ({ spaces, onSpaceClick }) => {
  const [usersData, setUsersData] = useState<DocumentIdMap<UserData>>({});

  useEffect(() => {
    const updateUsersData = async () => {
      const userService = serviceFactory.createUserService();
      const users = await userService.getCreatorDataByDocuments(spaces);
      setUsersData(users);
    }
    updateUsersData()
  }, [spaces])

  return (
    <div className='flex flex-col items-center w-full h-full space-y-4 overflow-y-auto'>
      <Typography variant="h5" className='pt-4'>
        スペースに参加する
      </Typography>
      {spaces.length === 0 ? (
        <SpacesEmptyMessage />
      ) : (
        <>
          <Typography>
            {spaces.length}つのスペースが見つかりました。
          </Typography>
          {spaces && spaces.map((space, index) => (
            <SpaceContainer
              key={index}
              spaceName={space.spaceName}
              authorName={usersData[space.createdById]?.username || "不明"}
              startTime={dateTimeToString(space.createdAt, {})}
              introduction={space.introduction}
              someMemberName={[]} // UNDONE
              memberNumber={space.members.length}
              requiresApproval={space.requiresApproval}
              onClick={() => onSpaceClick(space.docId)}
            />
          ))}
        </>

      )}
    </div>
  );
};

export default Spaces;