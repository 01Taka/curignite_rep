import { Button } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarElement } from '../../../types/app/home';

interface SidebarContainerViewProps {
  elements: SidebarElement[];
}

const SidebarContainerView: React.FC<SidebarContainerViewProps> = ({
    elements,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

  return (
    <div>
        {elements.map((element, index) => {
            const isActive = location.pathname === `/home/${element.link}`;
            return (
                <div className='flex flex-col w-full' key={index}>
                    <Button 
                      variant={isActive ? 'outlined' : 'text'} 
                      fullWidth 
                      onClick={() => navigate(element.link)} 
                      endIcon={element.icon}
                    >
                        {element.name}
                    </Button>
                </div>
            );
        })}
    </div>
  )
}

export default SidebarContainerView;
