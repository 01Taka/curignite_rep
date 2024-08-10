import React, { FC, useState } from 'react';
import CircularButton from '../../../../components/input/button/CircularButton';
import { useAppSelector } from '../../../../redux/hooks';
import { spaceStorage } from '../../../../functions/localStorage/storages';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const FinishLearning: FC = () => {
  const { currentSpaceId } = useAppSelector(state => state.spaceSlice);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFinishSpace = () => {
    spaceStorage.clear(currentSpaceId);
    handleClose();
  };

  return (
    <div className='self-end'>
      <CircularButton size="x4l" bgColor="main" onClick={handleClickOpen}>
        学習を<br />終える
      </CircularButton>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            本当に学習を終えますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleFinishSpace} color="primary">
            終える
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FinishLearning;
