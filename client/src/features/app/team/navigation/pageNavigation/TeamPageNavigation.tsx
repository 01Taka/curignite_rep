import React, { FC, useCallback, useMemo } from 'react';
import { navigationItems } from './navigationItems';
import CircularButton from '../../../../../components/input/button/CircularButton';
import { useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../../../types/path/mainPaths';
import { TeamHomePages } from '../../../../../types/app/team/teamTypes';
import { useAppSelector } from '../../../../../redux/hooks';
import { replaceParams } from '../../../../../functions/path/pathUtils';
import { PathParam } from '../../../../../types/path/paths';
import { Settings } from '@mui/icons-material';

const TeamPageNavigation: FC = () => {
  const navigate = useNavigate();
  const { uid } = useAppSelector(state => state.userSlice);
  const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);

  const teamData = teams[currentTeamId];

  const onClickNavigation = useCallback((path: TeamHomePages) => {
    const fullPath = `${replaceParams(teamPaths.home, { [PathParam.TeamId]: currentTeamId })}/${path}`;
    navigate(fullPath, { replace: true });
  }, [currentTeamId, navigate])

  const settingsButton = useMemo(() => {
    if (teamData && uid === teamData.createdById) {
      return (
        <CircularButton
          onClick={() => onClickNavigation("setting")}
          size="sm"
          className='mx-4'
        >
          <Settings />
        </CircularButton>
      );
    }
    return null;
  }, [teamData, uid, onClickNavigation]);

  return (
    <div className='flex justify-end w-full p-4'>
      {settingsButton}
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
};

export default TeamPageNavigation;
