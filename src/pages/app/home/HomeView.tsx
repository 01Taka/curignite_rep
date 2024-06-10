import React from 'react'
import SidebarContainer from '../../../components/app/sidebar/SidebarContainer'
import { Route, Routes } from 'react-router-dom'
import { HomeRouteItem } from '../../../types/app/home'
import MiniDrawer from './Sample';

interface HomeViewProps {
  routeItems: HomeRouteItem[];
}

const HomeView: React.FC<HomeViewProps> = ({
  routeItems,
}) => {
  return (
    <div className=''>
      <MiniDrawer />
      <div className='flex lg:px-32 sm:px-8 px-0 w-full max-w-screen-xl'>
          <div className='mr-8 lg:w-40 w-4 h-screen'>
            <SidebarContainer />
          </div>
          <div className='w-full min-h-screen'>
              <Routes>
                {routeItems.map((item, index) => (
                  <Route key={index} path={item.path} element={item.element} />
                ))}
              </Routes>
          </div>
      </div>
    </div>
  )
}

export default HomeView