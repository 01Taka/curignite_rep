import React, { FC, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { taskPaths } from '../../../types/path/mainPaths';
import { getLastSegment } from '../../../functions/path/pathUtils';
import TaskHome from './TaskHome';

const TaskRoutes: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === taskPaths.base) {
      navigate(taskPaths.home, { replace: true });
    }
  }, [location.pathname, navigate]);


  return (
    <Routes>
      <Route path={getLastSegment(taskPaths.home, true)} element={<TaskHome />} />
    </Routes>
  );
};

export default TaskRoutes;
