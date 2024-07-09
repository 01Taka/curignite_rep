import React, { ReactNode } from 'react'
import DrawerView from './DrawerView';

interface DrawerProps {
  children: ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ children }) => {
  return <DrawerView 
    elements={[]}
    children={children}
  />
}

export default Drawer