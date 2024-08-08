// OnMobilePages.tsx
import React, { FC, ReactNode } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { Routes } from 'react-router-dom';

interface OnMobilePagesProps {
  children: ReactNode;
}

const OnMobilePages: FC<OnMobilePagesProps> = ({ children }) => {
  const { device } = useAppSelector(state => state.userSlice);

  return device === "mobile" ? <Routes>{children}</Routes> : null;
};

export default OnMobilePages;