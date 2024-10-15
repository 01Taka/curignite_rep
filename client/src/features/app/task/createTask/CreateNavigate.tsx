import React, { FC } from 'react';
import CircularButton from '../../../../components/input/button/CircularButton';
import { Typography } from '@mui/material';
import Popup from '../../../../components/display/popup/Popup';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getLastSegment } from '../../../../functions/path/pathUtils';
import { taskPaths } from '../../../../types/path/mainPaths';
import { buttonConfigs } from './navigationButtonConfigs';

const CreateNavigate: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpen = (path: string) => {
    navigate(path);
  };

  const handleClose = () => {
    navigate(taskPaths.create);
  };

  return (
    <div className='flex flex-col justify-center items-center w-fit mx-auto p-8 mt-4 space-y-2 bg-secondaryBase rounded-lg'>
      <Typography variant='h4'>新規作成</Typography>
      <div className='flex space-x-8'>
        {buttonConfigs.map((config) => (
          <CircularButton
            key={config.path}
            looks="frame"
            bgColor="main"
            size="x4l"
            onClick={() => handleOpen(config.path)}
          >
            {config.label}
          </CircularButton>
        ))}
      </div>
      <Popup open={location.pathname !== taskPaths.create} handleClose={handleClose}>
        <Routes>
          {buttonConfigs.map((config) => (
            <Route
              key={config.path}
              path={getLastSegment(config.path)}
              element={config.content}
            />
          ))}
        </Routes>
      </Popup>
    </div>
  );
};

export default CreateNavigate;
