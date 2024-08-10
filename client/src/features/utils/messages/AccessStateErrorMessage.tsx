import { CircularProgress, Typography } from '@mui/material';
import React, { FC, ReactNode } from 'react';
import { JoinState } from '../../../types/firebase/db/baseTypes';
import { isApprovedJoinState } from '../../../functions/db/dbUtils';
import CircularButton from '../../../components/input/button/CircularButton';
import { useNavigate } from 'react-router-dom';
import { rootPaths } from '../../../types/path/paths';

interface AccessStateErrorMessageProps {
  joinState: JoinState;
  loading?: boolean;
  message: ReactNode;
  placeHomeLink?: boolean;
}

const AccessStateErrorMessage: FC<AccessStateErrorMessageProps> = ({ joinState, loading = false, message, placeHomeLink = true }) => {
  const navigate = useNavigate();

  if (loading || joinState === "loading") {
    return <CircularProgress />;
  }

  const toHome = () => {
    navigate(rootPaths.main);
  }

  if (!isApprovedJoinState(joinState)) {
    return (
      <div className='flex justify-center items-center w-full h-full'>
        <div className='flex flex-col items-center bg-secondaryBase p-8 rounded-lg'>
          <Typography variant="h6">{message}</Typography>
          {placeHomeLink &&
            <CircularButton bgColor="main" className=' self-end' onClick={toHome}>
              ホームに<br />戻る
            </CircularButton>
          }
        </div>
      </div>
    );
  }

  return null;
};

export default AccessStateErrorMessage;
