import React, { FC } from 'react'
import { NavigationItem } from '../../../../../types/path/path'
import CircularButton from '../../../../../components/input/button/CircularButton';

interface TeamNavigationViewProps {
    navigationItems: NavigationItem[];
    onClickNavigation: (path: string) => void;
}

const TeamNavigationView: FC<TeamNavigationViewProps> = ({ navigationItems, onClickNavigation }) => {
  return (
    <div className='flex justify-end w-full p-4'>
        {navigationItems.map((item, index) => (
            <div key={index}>
                <CircularButton onClick={() => onClickNavigation(item.path)} size={"sm"} className='mx-1'>
                    {item.icon}
                </CircularButton>
            </div>
        ))}
    </div>
  )
}

export default TeamNavigationView