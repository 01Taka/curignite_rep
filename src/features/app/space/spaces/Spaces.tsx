import React, { FC } from 'react';
import { Typography } from '@mui/material';
import SpaceContainer from './SpaceContainer';
import SpacesEmptyMessage from './SpacesEmptyMessage';
import { isMobileMode } from '../../../../functions/utils';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';
import { dateTimeToString } from '../../../../functions/dateTimeUtils';

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
          {spaces && spaces.map((space, index) => (
            <SpaceContainer
              key={index}
              spaceName={space.spaceName}
              authorName={space.authorName}
              startTime={dateTimeToString(space.createdAt, {}, false)}
              introduction={space.introduction}
              someMemberName={space.members.length > 0 ? space.members.slice(0, 3).map(member => member.username) : []}
              memberNumber={space.members.length}
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