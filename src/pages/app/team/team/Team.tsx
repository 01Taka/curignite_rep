import React, { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../types/path/appPaths';
import { useAppSelector } from '../../../../redux/hooks';

const Team: FC = () => {
  const navigate = useNavigate();
  const appSlice = useAppSelector(state => state.appSlice);
  const teamSlice = useAppSelector(state => state.teamSlice);

  useEffect(() => {
    if (appSlice.isMobile && teamSlice.currentDisplayTeam === null) {
      navigate(`${paths.main.team.index}/list`);
    }
  }, []);

  return (
    <div className='flex flex-col'>
      <div className='h-96'>M</div>
      <div className='h-96'>V</div>
      <div className='h-96'>V</div>
      <div className='h-96'>V</div>
      <div className='h-96'>V</div>
    </div>
  )
}

export default Team