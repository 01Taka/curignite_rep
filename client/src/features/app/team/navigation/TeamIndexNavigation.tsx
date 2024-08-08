import React, { FC } from 'react'
import CircularButton from '../../../../components/input/button/CircularButton';
import { Home } from '@mui/icons-material';
import Teams from '../teams/Teams';
import { useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';

const TeamIndexNavigation: FC = () => {
  const navigate = useNavigate();

  const handleToHome = () => {
    navigate(teamPaths.menu);
  }

  return (
    <div className='relative'>
        <CircularButton className='absolute right-2 top-2' size="sm" onClick={handleToHome}>
            <Home />
        </CircularButton>
        <div className='pt-8'/>
        <Teams />
    </div>
  )
}

export default TeamIndexNavigation