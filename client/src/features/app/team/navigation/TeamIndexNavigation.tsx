import React, { FC, useEffect } from 'react'
import CircularButton from '../../../../components/input/button/CircularButton';
import { Home, ArrowBack } from '@mui/icons-material';
import Teams from '../list/teams/Teams';
import { useLocation, useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { rootPaths } from '../../../../types/path/paths';
import { setCurrentTeamId } from '../../../../redux/slices/team/teamSlice';

const TeamIndexNavigation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { device } = useAppSelector(state => state.userSlice);

  useEffect(() => {
    if (device === "desktop" && location.pathname === teamPaths.base) {
      navigate(teamPaths.menu);
    }
  }, [device, location, navigate]);

  const handleToMenu = () => {
    dispatch(setCurrentTeamId(""));
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
          <CircularButton size="sm" onClick={handleToMenu}>
              <Home />
          </CircularButton>
        </div>
        <div className='h-8'/>
        <Teams />
    </div>
  )
}

export default TeamIndexNavigation