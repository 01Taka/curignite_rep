import React, { FC, useEffect } from 'react'
import CircularButton from '../../../../components/input/button/CircularButton';
import { Home, ArrowBack } from '@mui/icons-material';
import Teams from '../teams/Teams';
import { useLocation, useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { replaceParams } from '../../../../functions/path/pathUtils';
import { PathParam, rootPaths } from '../../../../types/path/paths';
import { setCurrentTeamId } from '../../../../redux/slices/team/teamSlice';

const TeamIndexNavigation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { device } = useAppSelector(state => state.userSlice);
  const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);

  useEffect(() => {
    if (device !== "desktop") return;

    const defaultTeam = teams[Object.keys(teams)[0]];
    const defaultTeamId = currentTeamId || defaultTeam?.docId || "";

    if (!defaultTeamId) {
      navigate(teamPaths.menu);
      return;
    }

    dispatch(setCurrentTeamId(defaultTeamId));

    if (location.pathname === teamPaths.base) {
      navigate(
        replaceParams(teamPaths.homeChildren.participants, { [PathParam.TeamId]: defaultTeamId }),
        { replace: true }
      );
    }
  }, [device, teams, currentTeamId, location, dispatch, navigate]);

  const handleToHome = () => {
    navigate(teamPaths.menu);
  }

  const handleToAppIndex = () => {
    navigate(rootPaths.main);
  }

  return (
    <div className='relative w-full h-full overflow-y-auto'>
        <div className='absolute flex w-full justify-between p-2'>
          <CircularButton size="sm" looks="transparent" onClick={handleToAppIndex}>
            <ArrowBack />
          </CircularButton>
          <CircularButton size="sm" onClick={handleToHome}>
              <Home />
          </CircularButton>
        </div>
        <div className='h-8'/>
        <Teams />
    </div>
  )
}

export default TeamIndexNavigation