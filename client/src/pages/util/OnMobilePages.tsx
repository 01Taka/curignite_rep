// OnMobilePages.tsx
import React, { FC, ReactNode } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { Routes } from 'react-router-dom';

interface OnMobilePagesProps {
  children: ReactNode;
}

const OnMobilePages: FC<OnMobilePagesProps> = ({ children }) => {
  const isMobile = useAppSelector(state => state.appSlice.isMobile);

  return isMobile ? <Routes>{children}</Routes> : null;
};

export default OnMobilePages;