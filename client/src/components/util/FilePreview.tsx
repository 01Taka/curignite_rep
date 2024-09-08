import React, { useState } from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material';
import FilePreviewPopup from './FilePreviewPopup';

interface FilePreviewProps {
  urls: string[];
  size?: number;
}

const FilePreview: React.FC<FilePreviewProps> = ({ urls, size = 50 }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClickOpen = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? urls.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === urls.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <>
      <Box display="flex" overflow="hidden" gap={1}>
        {urls.map((url, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="gainsboro"
            borderRadius={1}
            sx={{
              width: size,
              height: size,
              minWidth: size,
              minHeight: size,
              cursor: 'pointer',
            }}
            onClick={() => handleClickOpen(index)}
          >
            {url ? (
              <Box
                component="img"
                src={url}
                alt={`preview-${index}`}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                }}
              />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ width: '100%', height: '100%' }}
              >
                <Box fontSize={14} color="text.secondary">No Image</Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <FilePreviewPopup
        open={open}
        onClose={handleClose}
        currentUrl={urls[currentIndex]}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
};

export default FilePreview;
