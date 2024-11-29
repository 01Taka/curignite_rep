import React, { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';

interface LocationTabProps {
  items: { path: string; element: ReactNode }[]
}

const LocationTab: React.FC<LocationTabProps> = ({ items }) => {
  return (
    <Routes>
      {items.map((item, index) => {
        return <Route key={index} path={item.path} element={item.element}/>
      })}
    </Routes>
  );
};

export default LocationTab;