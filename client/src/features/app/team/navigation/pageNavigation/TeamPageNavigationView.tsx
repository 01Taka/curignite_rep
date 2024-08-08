import React, { FC } from 'react'
import { NavigationItem } from '../../../../../types/path/paths'
import CircularButton from '../../../../../components/input/button/CircularButton';
import { TeamPages } from '../../../../../pages/app/team/index/TeamIndex';

interface TeamPageNavigationViewProps {
    navigationItems: NavigationItem<TeamPages>[];
    onClickNavigation: (path: TeamPages) => void;
}

const TeamPageNavigationView: FC<TeamPageNavigationViewProps> = ({ navigationItems, onClickNavigation }) => {
  return (
    <div className='flex justify-end w-full p-4'>
        {navigationItems && navigationItems.map((item, index) => (
            <div key={index} className='flex'>
                <CircularButton onClick={() => onClickNavigation(item.path)} size={"sm"} className='mx-1'>
                    {item.icon}
                </CircularButton>
            </div>
        ))}
    </div>
  )
}

export default TeamPageNavigationView