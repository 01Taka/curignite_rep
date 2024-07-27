import React, { FC, useEffect, useState } from 'react';
import { SpaceData } from '../../../../types/firebase/db/spacesTypes';
import { Typography } from '@mui/material';
import SpaceContainer from './SpaceContainer';
import SpacesEmptyMessage from './SpacesEmptyMessage';
import { relativeDateString } from '../../../../functions/dateTimeUtils';
import { isMobileMode } from '../../../../functions/utils';
import { getUsersDataByUids } from '../../../../firebase/db/app/user/userDBUtil';
import { UserDictionary } from '../../../../types/firebase/db/usersTypes';

export interface SpacesProps {
  spaces: SpaceData[];
}

const Spaces: FC<SpacesProps> = ({ spaces }) => {
  const [usersDict, setUsersDict] = useState<UserDictionary>({});
  useEffect(() => {
    const updateUserDict = async () => {
      const uids = spaces.flatMap(space => space.memberUids);
      const usersDict = await getUsersDataByUids(uids);
      setUsersDict(usersDict);
    }

    updateUserDict()
  }, [spaces]);

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
          {spaces.map((space, index) => (
            <SpaceContainer
              key={index}
              spaceName={space.spaceName}
              authorName={space.authorName}
              startTime={relativeDateString(space.createdAt)}
              introduction={space.introduction}
              someMemberName={space.memberUids.map(uid => usersDict[uid].username)}
              memberNumber={space.memberUids.length}
              requiredApproval={space.requiredApproval}
              mobileMode={isMobileMode()}
            />
          ))}
        </>

      )}
    </div>
  );
};

export default Spaces;