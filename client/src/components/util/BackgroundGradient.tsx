import { Skeleton } from '@mui/material';
import React, { FC, ReactNode, CSSProperties } from 'react';

interface BackgroundGradientProps {
  children: ReactNode;
  height: number;
  width: number;
  color?: string;
}

const BackgroundGradient: FC<BackgroundGradientProps> = ({ children, height, width, color = 'orange' }) => {
  const containerStyle: CSSProperties = { maxHeight: "100px", width };
  
  return (
    <div className="relative" style={containerStyle}>
      <div className="flex justify-center items-center absolute inset-0">
        {children}
      </div>
      <Skeleton
        className="absolute inset-0 -z-10"
        sx={{ bgcolor: color }}
        width={width}
        height={height}
        animation="wave"
      />
    </div>
  );
};

export default BackgroundGradient;
