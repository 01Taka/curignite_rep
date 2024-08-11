import React, { FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface CommonDialogProps {
  open: boolean;
  handleClose: () => void;
  handleAction: () => void;
  title: string;
  content: string;
  actionText: string;
}

const CommonDialog: FC<CommonDialogProps> = ({ open, handleClose, handleAction, title, content, actionText }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          キャンセル
        </Button>
        <Button onClick={handleAction} color="primary">
          {actionText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialog;
