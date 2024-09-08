import React from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material';

interface FilePreviewPopupProps {
  open: boolean;
  currentUrl: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const FilePreviewPopup: React.FC<FilePreviewPopupProps> = ({ open, currentUrl, onClose, onNext, onPrev }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box position="relative" display="flex" justifyContent="center" alignItems="center" minHeight={150}>
        <IconButton
          onClick={onPrev}
          sx={{ position: 'absolute', left: 16 }}
        >
          <ArrowBackIos />
        </IconButton>

        <Box
          component="img"
          src={currentUrl}
          alt="preview"
          sx={{ maxHeight: '80vh', maxWidth: '80vw' }}
        />

        <IconButton
          onClick={onNext}
          sx={{ position: 'absolute', right: 16 }}
        >
          <ArrowForwardIos />
        </IconButton>

        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <Close />
        </IconButton>
      </Box>
    </Dialog>
  );
};

export default FilePreviewPopup;
