import React, { FC, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../home/Home';
import TeamRoutes from '../team/TeamRoutes';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import NotFound from '../../error/NotFound';
import { CircularProgress } from '@mui/material';
import { mainRootPaths } from '../../../types/path/mainPaths';
import { autoUpdateSpaces } from '../../../redux/actions/space/spaceActions';
import TaskRoutes from '../task/TaskRoutes';
import { setApprovedTeams } from '../../../redux/actions/team/teamActions';

const MainRoutes: FC = () => {
  const dispatch = useAppDispatch();
  const { uid, userFetchState } = useAppSelector(state => state.userSlice);

  useEffect(() => {
    if (uid) {
      setApprovedTeams(dispatch, uid);
      autoUpdateSpaces(dispatch, uid);
    }
  }, [dispatch, uid]);

  return (
    <div className='w-full h-full bg-primaryBase overflow-auto'>
      <Routes>
        {userFetchState.state !== "success" && <Route path="/*" element={<CircularProgress />} />}
        <Route path="/" element={<Home />} />
        <Route path='*' element={<NotFound />} />
        <Route path={mainRootPaths.task} element={<TaskRoutes />} />
        <Route path={mainRootPaths.team} element={<TeamRoutes />} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
