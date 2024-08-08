import React, { FC } from 'react';
import { navigationItems } from './navigationItems';
import CircularButton from '../../../../../components/input/button/CircularButton';
import { useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../../../types/path/mainPaths';
import { TeamHomePages } from '../../../../../types/app/team/teamTypes';
import { useAppSelector } from '../../../../../redux/hooks';
import { replaceParams } from '../../../../../functions/path/pathUtils';
import { PathParam } from '../../../../../types/path/paths';

const TeamPageNavigation: FC = () => {
  const navigate = useNavigate();
  const currentTeamId = useAppSelector(state => state.teamSlice.currentTeamId);

  const onClickNavigation = (path: TeamHomePages) => {
    navigate(`${replaceParams(teamPaths.home, { [PathParam.TeamId]: currentTeamId })}/${path}`, { replace: true });
  };

  return (
    <div className='flex justify-end w-full p-4'>
      {navigationItems.map(item => (
        <CircularButton 
          key={item.path} 
          onClick={() => onClickNavigation(item.path)} 
          size="sm" 
          className='mx-1'
        >
          {item.icon}
        </CircularButton>
      ))}
    </div>
  );
}

export default TeamPageNavigation;
