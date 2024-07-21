import React, { FC, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { relativeMainPaths } from '../../../types/path/appPaths';
import Home from '../home/Home';
import TeamRoutes from '../team/TeamRoutes';
import mainPreprocessing from './mainPreprocessing';
import { useAppDispatch } from '../../../redux/hooks';
import NotFound from '../../error/NotFound';

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
      <Route path={relativeMainPaths.space} element={<div>Space</div>} />
      <Route path={relativeMainPaths.chat} element={<div>Chat</div>} />
      <Route path={relativeMainPaths.whiteboard} element={<div>Whiteboard</div>} />
      <Route path={relativeMainPaths.calendar} element={<div>Calendar</div>} />
      <Route path={relativeMainPaths.todo} element={<div>Todo</div>} />
      <Route path={`${relativeMainPaths.team}/*`} element={<TeamRoutes />} />
      <Route path={relativeMainPaths.goal} element={<div>Goal</div>} />
      <Route path={relativeMainPaths.qAndA} element={<div>Q&A</div>} />
    </Routes>
  </div>
  );
};

export default MainRoutes;
