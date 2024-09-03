import React, { FC, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../home/Home';
import TeamRoutes from '../team/TeamRoutes';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import NotFound from '../../error/NotFound';
import SpaceRoutes from '../space/SpaceRoutes';
import ChatRoom from '../../../components/app/chat/ChatRoom';
import { CircularProgress } from '@mui/material';
import { mainRootPaths } from '../../../types/path/mainPaths';
import { autoUpdateTeams } from '../../../redux/actions/team/teamActions';
import { autoUpdateSpaces } from '../../../redux/actions/space/spaceActions';
import TaskRoutes from '../task/TaskRoutes';

const MainRoutes: FC = () => {
  const dispatch = useAppDispatch();
  const { uid, userFetchState } = useAppSelector(state => state.userSlice);

  useEffect(() => {
    if (uid) {
      autoUpdateTeams(dispatch, uid);
      autoUpdateSpaces(dispatch, uid);
    }
  }, [dispatch, uid]);

  return (
    <div className='w-full h-full bg-primaryBase overflow-auto'>
      <Routes>
        {userFetchState.state !== "success" && <Route path="/*" element={<CircularProgress />} />}
        <Route path="/" element={<Home />} />
        <Route path='*' element={<NotFound />} />
        <Route path={mainRootPaths.space} element={<SpaceRoutes />} />
        <Route path={mainRootPaths.chat} element={<ChatRoom chatRoomId='tmYbshDZiPUQ4Xmv2Z2V'/>} />
        <Route path={mainRootPaths.whiteboard} element={<div>Whiteboard</div>} />
        <Route path={mainRootPaths.calendar} element={<div>Calendar</div>} />
        <Route path={mainRootPaths.task} element={<TaskRoutes />} />
        <Route path={mainRootPaths.team} element={<TeamRoutes />} />
        <Route path={mainRootPaths.goal} element={<div>Goal</div>} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
