import React from 'react'
import SidebarContainerView from './SidebarContainerView'
import { Error, Help, Home } from '@mui/icons-material';
import { SidebarElement } from '../../../types/app/home';

const SidebarContainer: React.FC = () => {
  const elements: SidebarElement[] = [
    {name: 'Home', link: 'profile', icon: <Home />},
    {name: '質問する', link: 'question', icon: <Help />},
    {name: '回答する', link: 'answer', icon: <Error />},
  ]

  return <SidebarContainerView 
    elements={elements}
  />
}

export default SidebarContainer