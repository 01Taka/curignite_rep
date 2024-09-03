import React, { FC, useState } from 'react';
import CircularButton from '../../../../../components/input/button/CircularButton';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { endLearningSession } from '../../../../../functions/app/space/learningSessionUtils';
import { useNavigate } from 'react-router-dom';
import { rootPaths } from '../../../../../types/path/paths';
import serviceFactory from '../../../../../firebase/db/factory';
import { spacePaths } from '../../../../../types/path/mainPaths';
import Popup from '../../../../../components/util/Popup';
import SpaceFinishDialog from './SpaceFinishDialog';
import SpaceMoveDialog from './SpaceMoveDialog';

const FinishLearning: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { uid } = useAppSelector(state => state.userSlice);
  const { currentSpaceId, } = useAppSelector(state => state.spaceSlice);
  const [openFinish, setOpenFinish] = useState(false);
  const [openMove, setOpenMove] = useState(false);

  const handleClickOpenFinish = () => {
    setOpenFinish(true);
  };

  const handleCloseFinish = () => {
    setOpenFinish(false);
  };

  const handleClickOpenMove = () => {
    setOpenMove(true);
  };

  const handleCloseMove = () => {
    setOpenMove(false);
  };

  const handleFinishSpace = async () => {
    try {
      if (uid) {
        await endLearningSession(dispatch, uid);
        handleCloseFinish();
        navigate(rootPaths.main);
      }
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  };

  const handleMoveSpace = async () => {
    if (uid && currentSpaceId) {
      const spaceService = serviceFactory.createSpaceService();
      await spaceService.leaveSpace(uid, currentSpaceId);
      handleCloseMove();
      navigate(spacePaths.start);
    }
  };

  return (
    <div className='self-center flex flex-col items-center justify-center space-y-4'>
      <CircularButton size="xl" bgColor="secondaryBase" onClick={handleClickOpenMove}>
        スペース<br />を移動
      </CircularButton>
      <CircularButton size="x4l" bgColor="main" onClick={handleClickOpenFinish}>
        学習を<br />終える
      </CircularButton>

      <Popup open={openFinish} handleClose={handleCloseFinish} >
        <SpaceFinishDialog />
      </Popup>

      <Popup open={openMove} handleClose={handleCloseMove} >
        <SpaceMoveDialog />
      </Popup>
    </div>
  );
};

export default FinishLearning;
