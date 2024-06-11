import React, { ReactNode } from 'react'
import DrawerView from './DrawerView';
import { elements } from '../../../pages/app/home/routing';

interface DrawerProps {
  children: ReactNode;
}
const Drawer: React.FC<DrawerProps> = ({ children }) => {
  return <DrawerView 
    elements={[elements]}
    children={children}
  />
}

export default Drawer