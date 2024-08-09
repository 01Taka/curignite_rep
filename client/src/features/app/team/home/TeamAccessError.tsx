import React, { FC } from 'react';
import { JoinState } from '../../../../types/firebase/db/baseTypes';
import { CircularProgress, Typography } from '@mui/material';
import { isApprovedJoinState } from '../../../../functions/db/dbUtils';

interface TeamAccessErrorProps {
  joinState: JoinState;
}

const TeamAccessError: FC<TeamAccessErrorProps> = ({ joinState }) => {
  if (isApprovedJoinState(joinState)) return null;

  if (joinState === "loading") {
    return <CircularProgress />;
  }

  return (
    <div className='flex justify-center items-center w-full h-full'>
      <div className='bg-secondaryBase p-8 rounded-lg'>
        <Typography variant="h6">このチームへのアクセスは許可されていません。</Typography>
      </div>
    </div>
  );
};

export default TeamAccessError;
