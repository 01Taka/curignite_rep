import React, { FC, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { mainRootPaths } from '../../../types/path/appPaths';
import Home from '../home/Home';
import TeamRoutes from '../team/TeamRoutes';
import mainPreprocessing from './mainPreprocessing';
import { useAppDispatch } from '../../../redux/hooks';
import NotFound from '../../error/NotFound';
import SpaceRoutes from '../space/SpaceRoutes';

const MainRoutes: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    mainPreprocessing(navigate, dispatch);
  }, [navigate, dispatch]);


  return (
    <div className='w-full h-full bg-primaryBase overflow-auto'>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='*' element={<NotFound />} />
      <Route path={mainRootPaths.space} element={<SpaceRoutes />} />
      <Route path={mainRootPaths.chat} element={<div>Chat</div>} />
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
