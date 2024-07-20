// SideBar.tsx
import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import { SideBarProps } from '../navigationTypes';
import { cn } from '../../../functions/utils';

const SideBar: React.FC<SideBarProps> = ({ elements, width = "w-16" }) => {
  return (
    <div className={cn(width)}>
      <div className='pt-16'>
        <List>
          {elements.map((element, index) => (
            <ListItem key={index} button onClick={element.action}>
              <Tooltip title={element.text} arrow placement='right'>
                <div className="flex items-center">
                  {element.icon}
                </div>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default SideBar;
