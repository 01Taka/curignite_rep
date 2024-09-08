import React from 'react';
import { Box } from '@mui/material';

interface FilePreviewProps {
  urls: string[];
  size?: number;
}

const FilePreview: React.FC<FilePreviewProps> = ({ urls, size = 50 }) => {
  return (
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
          }}
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
              {/* プレースホルダーを表示するアイコンまたはテキスト */}
              <Box fontSize={14} color="text.secondary">No Image</Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default FilePreview;
