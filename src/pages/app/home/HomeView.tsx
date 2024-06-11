import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomeRouteItem } from '../../../types/app/home'
import Drawer from '../../../components/app/drawer/Drawer';

interface HomeViewProps {
  routeItems: HomeRouteItem[];
}

const HomeView: React.FC<HomeViewProps> = ({
  routeItems,
}) => {
  return (
    <Drawer>
        <div className='pl-6 pr-8 py-4'>
          <Routes>
            {routeItems.map((item, index) => (
              <Route key={index} path={item.path} element={item.element} />
            ))}
          </Routes>
        </div>
      </Drawer>
  )
}

export default HomeView