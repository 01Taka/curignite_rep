import React, { FC, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { mainRootPaths } from '../../../types/path/appPaths';
import Home from '../home/Home';
import TeamRoutes from '../team/TeamRoutes';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import NotFound from '../../error/NotFound';
import SpaceRoutes from '../space/SpaceRoutes';
import { updateTeamData } from '../../../redux/actions/team/updateTeamData';
import ChatRoom from '../../../components/app/chat/ChatRoom';
import { updateUserState } from '../../../redux/actions/user/updateUserState';
import { CircularProgress } from '@mui/material';

const MainRoutes: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.userSlice);

  useEffect(() => {
    dispatch(updateUserState())
      .unwrap()
      .then((path) => {
        if (path) {
          navigate(path);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          console.error(error.message);
        }
      });
  }, [navigate, dispatch]);

  useEffect(() => {
    if (userData.uid) {
      dispatch(updateTeamData(userData.uid));
    }
  }, [dispatch, userData.uid]);

  return (
    <div className='w-full h-full bg-primaryBase overflow-auto'>
      <Routes>
        {userData.requestState !== "success" && <Route path="/*" element={<CircularProgress />} />}
        <Route path="/" element={<Home />} />
        <Route path='*' element={<NotFound />} />
        <Route path={mainRootPaths.space} element={<SpaceRoutes />} />
        <Route path={mainRootPaths.chat} element={<ChatRoom chatRoomId='tmYbshDZiPUQ4Xmv2Z2V'/>} />
        <Route path={mainRootPaths.whiteboard} element={<div>Whiteboard</div>} />
        <Route path={mainRootPaths.calendar} element={<div>Calendar</div>} />
        <Route path={mainRootPaths.todo} element={<div>Todo</div>} />
        <Route path={mainRootPaths.team} element={<TeamRoutes />} />
        <Route path={mainRootPaths.goal} element={<div>Goal</div>} />
        <Route path={mainRootPaths.qAndA} element={<div>Q&A</div>} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
