import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

import Drawer from '../../../components/app/drawer/Drawer';
import Home from '../home/Home';
import { RouteItemProps } from './routing';

interface IndexPageViewProps {
  routeItems: RouteItemProps[];
}

const IndexPageView: FC<IndexPageViewProps> = ({
  routeItems,
}) => {
  return (
      <div className='pl-6 pr-8 py-4 w-full h-screen bg-primaryBase'>
        <Drawer>
        <Routes>
          <Route path='*' element={<Home />} />
            {routeItems.map((item, indexPage) => (
              <Route key={indexPage} path={item.path} element={item.element} />
            ))}
          </Routes>
        </Drawer>
      </div>
  )
}

export default IndexPageView