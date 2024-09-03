import React, { FC, ReactNode } from 'react';
import { Typography } from '@mui/material';
import CircularButton from '../../../components/input/button/CircularButton';
import { useNavigate } from 'react-router-dom';
import { rootPaths } from '../../../types/path/paths';

interface AccessStateErrorMessageProps {
  message: ReactNode;
  placeHomeLink?: boolean;
}

const AccessStateErrorMessage: FC<AccessStateErrorMessageProps> = ({ message, placeHomeLink = true }) => {
  const navigate = useNavigate();

  const toHome = () => {
    navigate(rootPaths.main);
  }

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
};

export default AccessStateErrorMessage;
