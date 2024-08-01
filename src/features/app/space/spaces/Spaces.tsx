import React, { FC } from 'react';
import { Typography } from '@mui/material';
import SpaceContainer from './SpaceContainer';
import SpacesEmptyMessage from './SpacesEmptyMessage';
import { relativeDateString } from '../../../../functions/dateTimeUtils';
import { isMobileMode } from '../../../../functions/utils';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';

export interface SpacesProps {
  spaces: SpaceData[];
}

const Spaces: FC<SpacesProps> = ({ spaces }) => {
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
              someMemberName={space.members.slice(0, 3).map(member => member.username)}
              memberNumber={space.participants.members.length}
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