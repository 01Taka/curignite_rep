import React, { ReactNode } from 'react';
import { Typography, Box, SxProps } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

interface MultiLineTextProps {
  children: ReactNode;
  variant?: Variant;
  textAlign?: 'start' | 'center' | 'end';
  maxLines?: number;
  fontSize?: string;
  lineHeight?: number;
  overflowBehavior?: 'scroll' | 'hidden'; 
  sx?: SxProps;
}

const MultiLineText: React.FC<MultiLineTextProps> = ({
  children,
  variant,
  textAlign,
  maxLines = Number.MAX_SAFE_INTEGER,
  fontSize,
  lineHeight = 1,
  overflowBehavior = 'hidden',
  sx,
}) => {
  return (
    <Box>
      <Typography
        variant={variant}
        sx={{
          textAlign,
          fontSize,
          lineHeight,
          overflow: overflowBehavior === 'scroll' ? 'auto' : 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: overflowBehavior === 'hidden' ? maxLines : undefined,
          WebkitBoxOrient: 'vertical',
          hyphens: 'auto',
          overflowWrap: 'break-word',
          ...sx,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default MultiLineText;
