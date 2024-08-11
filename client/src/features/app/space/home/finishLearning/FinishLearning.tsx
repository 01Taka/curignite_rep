import React, { FC, useState } from 'react';
import CircularButton from '../../../../../components/input/button/CircularButton';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { endLearningSession } from '../../../../../functions/app/space/learningSessionUtils';
import CommonDialog from './CommonDialog';
import { useNavigate } from 'react-router-dom';
import { rootPaths } from '../../../../../types/path/paths';

const FinishLearning: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { uid } = useAppSelector(state => state.userSlice);
  const [openFinish, setOpenFinish] = useState(false);
  const [openMove, setOpenMove] = useState(false); // State for MoveDialog

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
    // Add logic for moving the user to another space
    handleCloseMove();
  };

  return (
    <div className='self-end flex flex-col items-center justify-center space-y-4'>
      <CircularButton size="xl" bgColor="secondaryBase" onClick={handleClickOpenMove}>
        スペース<br />を移動
      </CircularButton>
      <CircularButton size="x4l" bgColor="main" onClick={handleClickOpenFinish}>
        学習を<br />終える
      </CircularButton>

      <CommonDialog
        open={openFinish}
        handleClose={handleCloseFinish}
        handleAction={handleFinishSpace}
        title="確認"
        content="本当に学習を終えますか？"
        actionText="終える"
      />
      <CommonDialog
        open={openMove}
        handleClose={handleCloseMove}
        handleAction={handleMoveSpace}
        title="確認"
        content="このスペースを一時的に離籍して他のスペースに移動しますか？"
        actionText="移動"
      />
    </div>
  );
};

export default FinishLearning;
