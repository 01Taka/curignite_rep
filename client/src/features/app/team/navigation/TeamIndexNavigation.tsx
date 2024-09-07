import React, { FC, useEffect } from 'react'
import CircularButton from '../../../../components/input/button/CircularButton';
import { Home, ArrowBack } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';
import { useAppSelector } from '../../../../redux/hooks';
import { PathParam, rootPaths } from '../../../../types/path/paths';
import TeamIcons from '../teams/TeamIcons';
import { replaceParams } from '../../../../functions/path/pathUtils';
import { ConvertTimestampToNumber } from '../../../../types/firebase/db/formatTypes';
import { TeamData } from '../../../../types/firebase/db/team/teamStructure';

const TeamIndexNavigation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { device } = useAppSelector(state => state.userSlice);

  useEffect(() => {
    if (device === "desktop" && location.pathname === teamPaths.base) {
      navigate(teamPaths.menu);
    }
  }, [device, location, navigate]);

  const handleToMenu = () => {
    navigate(teamPaths.menu);
  }

  const handleToAppIndex = () => {
    navigate(rootPaths.main);
  }

  const handleNavigateToTeamView = (team: ConvertTimestampToNumber<TeamData>) => {
    navigate(replaceParams(teamPaths.homeChildren.participants, { [PathParam.TeamId]: team.docId }))
  }

  return (
    <div className='relative w-full h-full overflow-y-auto'>
        <div className='absolute flex w-full justify-between p-2'>
          <CircularButton size="sm" looks="transparent" onClick={handleToAppIndex}>
            <ArrowBack />
          </CircularButton>
          <CircularButton size="sm" onClick={handleToMenu}>
              <Home />
          </CircularButton>
        </div>
        <div className='h-16'/>
        <TeamIcons onClickTeam={handleNavigateToTeamView} />
    </div>
  )
}

export default TeamIndexNavigation